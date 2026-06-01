from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    # Validate customer exists
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total_amount = 0.0
    order_items_data = []

    # Validate products and stock
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        if product.quantity_in_stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for product '{product.name}'. Available: {product.quantity_in_stock}, Requested: {item.quantity}"
            )
        line_total = product.price * item.quantity
        total_amount += line_total
        order_items_data.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "unit_price": product.price
        })

    # Create order
    db_order = Order(customer_id=order.customer_id, total_amount=round(total_amount, 2))
    db.add(db_order)
    db.flush()

    # Create order items and reduce stock
    for oi in order_items_data:
        db_item = OrderItem(order_id=db_order.id, **oi)
        db.add(db_item)
        product = db.query(Product).filter(Product.id == oi["product_id"]).first()
        product.quantity_in_stock -= oi["quantity"]

    db.commit()
    db.refresh(db_order)
    return _build_order_response(db_order)


@router.get("", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return [_build_order_response(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return _build_order_response(order)


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()


def _build_order_response(order: Order) -> OrderResponse:
    items = []
    for item in order.items:
        product_name = item.product.name if item.product else ""
        items.append(OrderItemResponse(
            id=item.id,
            product_id=item.product_id,
            product_name=product_name,
            quantity=item.quantity,
            unit_price=item.unit_price
        ))
    return OrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=order.customer.full_name if order.customer else "",
        total_amount=order.total_amount,
        items=items,
        created_at=order.created_at
    )

