#!/usr/bin/env python3
import urllib.request
import json

BASE = 'https://inventoryandordermgmtsystem.onrender.com'

def post(path, data):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data).encode(),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        resp = urllib.request.urlopen(req)
        result = json.loads(resp.read())
        print(f'  OK: {path} -> id={result.get("id")}')
        return result
    except Exception as e:
        print(f'  ERR: {path} -> {e}')
        return None

print('=== Creating Products ===')
products = [
    {'name': 'MacBook Pro 16', 'sku': 'MBP-016', 'price': 2499.99, 'quantity_in_stock': 25},
    {'name': 'Wireless Mouse', 'sku': 'WM-100', 'price': 29.99, 'quantity_in_stock': 150},
    {'name': 'Mechanical Keyboard', 'sku': 'MK-200', 'price': 89.99, 'quantity_in_stock': 75},
    {'name': '27-inch Monitor', 'sku': 'MON-270', 'price': 449.99, 'quantity_in_stock': 30},
    {'name': 'USB-C Hub', 'sku': 'HUB-301', 'price': 59.99, 'quantity_in_stock': 200},
    {'name': 'Webcam HD', 'sku': 'WC-400', 'price': 79.99, 'quantity_in_stock': 8},
    {'name': 'Noise Cancelling Headphones', 'sku': 'NCH-500', 'price': 349.99, 'quantity_in_stock': 5},
    {'name': 'Laptop Stand', 'sku': 'LS-600', 'price': 39.99, 'quantity_in_stock': 3},
]
for p in products:
    post('/products', p)

print('\n=== Creating Customers ===')
customers = [
    {'full_name': 'Alice Johnson', 'email': 'alice@example.com', 'phone_number': '9876543210'},
    {'full_name': 'Bob Smith', 'email': 'bob@example.com', 'phone_number': '5551234567'},
    {'full_name': 'Carol Williams', 'email': 'carol@example.com', 'phone_number': '4449876543'},
    {'full_name': 'David Brown', 'email': 'david@example.com', 'phone_number': '3335551212'},
]
for c in customers:
    post('/customers', c)

print('\n=== Creating Orders ===')
orders = [
    {'customer_id': 2, 'items': [{'product_id': 2, 'quantity': 10}, {'product_id': 6, 'quantity': 5}]},
    {'customer_id': 3, 'items': [{'product_id': 3, 'quantity': 2}, {'product_id': 7, 'quantity': 3}]},
    {'customer_id': 4, 'items': [{'product_id': 5, 'quantity': 1}, {'product_id': 8, 'quantity': 2}]},
    {'customer_id': 5, 'items': [{'product_id': 9, 'quantity': 2}, {'product_id': 4, 'quantity': 1}]},
]
for o in orders:
    post('/orders', o)

print('\n=== Dashboard ===')
resp = urllib.request.urlopen(BASE + '/dashboard')
data = json.loads(resp.read())
print(f'  Total Products: {data["total_products"]}')
print(f'  Total Customers: {data["total_customers"]}')
print(f'  Total Orders: {data["total_orders"]}')
print(f'  Low Stock Products: {len(data["low_stock_products"])}')
for p in data['low_stock_products']:
    print(f'    - {p["name"]} ({p["sku"]}): {p["quantity_in_stock"]} left')

print('\nDone! Go check the UI at https://inventory-and-order-mgmt-system.vercel.app/')

