import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard data'));
  }, []);

  if (error) return <div className="message error">{error}</div>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card"><h3>Total Products</h3><div className="value">{data.total_products}</div></div>
        <div className="card"><h3>Total Customers</h3><div className="value">{data.total_customers}</div></div>
        <div className="card"><h3>Total Orders</h3><div className="value">{data.total_orders}</div></div>
        <div className="card"><h3>Low Stock Items</h3><div className="value">{data.low_stock_products.length}</div></div>
      </div>
      {data.low_stock_products.length > 0 && (
        <div className="section">
          <h2>Low Stock Products (below 10 units)</h2>
          <ul className="low-stock-list">
            {data.low_stock_products.map((p) => (
              <li key={p.id}>
                <span>{p.name} ({p.sku})</span>
                <span className="stock-badge">{p.quantity_in_stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
