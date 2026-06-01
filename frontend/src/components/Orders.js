import React, { useState, useEffect } from 'react';
import api from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: '' }]);
  const [message, setMessage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => api.get('/orders').then(res => setOrders(res.data)).catch(console.error);
  const fetchCustomers = () => api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);
  const fetchProducts = () => api.get('/products').then(res => setProducts(res.data)).catch(console.error);

  useEffect(() => { fetchOrders(); fetchCustomers(); fetchProducts(); }, []);

  const showMessage = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage(null), 3000); };

  const addItem = () => setItems([...items, { product_id: '', quantity: '' }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index, field, value) => { const newItems = [...items]; newItems[index][field] = value; setItems(newItems); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) { showMessage('Select a customer', 'error'); return; }
    const orderItems = items.filter(i => i.product_id && i.quantity).map(i => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) }));
    if (orderItems.length === 0) { showMessage('Add at least one product', 'error'); return; }
    try {
      await api.post('/orders', { customer_id: parseInt(customerId), items: orderItems });
      showMessage('Order created successfully', 'success');
      setCustomerId(''); setItems([{ product_id: '', quantity: '' }]);
      fetchOrders(); fetchProducts();
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Error creating order', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try { await api.delete(`/orders/${id}`); showMessage('Order deleted', 'success'); fetchOrders(); }
    catch (err) { showMessage(err.response?.data?.detail || 'Error deleting', 'error'); }
  };

  const viewDetails = async (id) => {
    try { const res = await api.get(`/orders/${id}`); setSelectedOrder(res.data); }
    catch (err) { showMessage('Error loading order details', 'error'); }
  };

  return (
    <div>
      <div className="section">
        <h2>Create Order</h2>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer</label>
            <select value={customerId} onChange={e => setCustomerId(e.target.value)}>
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </div>
          <label style={{fontWeight:500, marginBottom:10, display:'block'}}>Order Items</label>
          {items.map((item, index) => (
            <div key={index} className="order-item-row">
              <div className="form-group">
                <select value={item.product_id} onChange={e => updateItem(index, 'product_id', e.target.value)}>
                  <option value="">Select product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity_in_stock})</option>)}
                </select>
              </div>
              <div className="form-group"><input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} /></div>
              {items.length > 1 && <button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>X</button>}
            </div>
          ))}
          <button type="button" className="btn btn-success" onClick={addItem} style={{marginRight:10}}>+ Add Item</button>
          <button className="btn btn-primary" type="submit">Place Order</button>
        </form>
      </div>

      {selectedOrder && (
        <div className="section">
          <h2>Order #{selectedOrder.id} Details</h2>
          <p><strong>Customer:</strong> {selectedOrder.customer_name}</p>
          <p><strong>Total:</strong> ${selectedOrder.total_amount.toFixed(2)}</p>
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {selectedOrder.items.map(i => (
                <tr key={i.id}><td>{i.product_name}</td><td>{i.quantity}</td><td>${i.unit_price.toFixed(2)}</td><td>${(i.quantity * i.unit_price).toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
          <button className="btn" onClick={() => setSelectedOrder(null)} style={{marginTop:10}}>Close</button>
        </div>
      )}

      <div className="section">
        <h2>Orders List</h2>
        <table>
          <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td><td>{o.customer_name}</td><td>${o.total_amount.toFixed(2)}</td><td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => viewDetails(o.id)} style={{marginRight:5}}>View</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(o.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p style={{marginTop:15, color:'#999'}}>No orders yet.</p>}
      </div>
    </div>
  );
}

export default Orders;
