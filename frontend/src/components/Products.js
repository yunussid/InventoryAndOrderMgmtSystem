import React, { useState, useEffect } from 'react';
import api from '../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity_in_stock: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchProducts = () => api.get('/products').then(res => setProducts(res.data)).catch(console.error);

  useEffect(() => { fetchProducts(); }, []);

  const showMessage = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage(null), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.price || !form.quantity_in_stock) {
      showMessage('All fields are required', 'error'); return;
    }
    const payload = { ...form, price: parseFloat(form.price), quantity_in_stock: parseInt(form.quantity_in_stock) };
    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        showMessage('Product updated successfully', 'success');
      } else {
        await api.post('/products', payload);
        showMessage('Product created successfully', 'success');
      }
      setForm({ name: '', sku: '', price: '', quantity_in_stock: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Error saving product', 'error');
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, sku: p.sku, price: String(p.price), quantity_in_stock: String(p.quantity_in_stock) });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); showMessage('Product deleted', 'success'); fetchProducts(); }
    catch (err) { showMessage(err.response?.data?.detail || 'Error deleting', 'error'); }
  };

  return (
    <div>
      <div className="section">
        <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label>SKU</label><input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} /></div>
            <div className="form-group"><label>Price</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
            <div className="form-group"><label>Quantity</label><input type="number" value={form.quantity_in_stock} onChange={e => setForm({...form, quantity_in_stock: e.target.value})} /></div>
          </div>
          <button className="btn btn-primary" type="submit">{editId ? 'Update' : 'Add'} Product</button>
          {editId && <button className="btn" type="button" onClick={() => { setEditId(null); setForm({ name: '', sku: '', price: '', quantity_in_stock: '' }); }} style={{marginLeft:10}}>Cancel</button>}
        </form>
      </div>
      <div className="section">
        <h2>Products List</h2>
        <table>
          <thead><tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td><td>{p.sku}</td><td>${p.price.toFixed(2)}</td><td>{p.quantity_in_stock}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(p)} style={{marginRight:5}}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p style={{marginTop:15, color:'#999'}}>No products yet.</p>}
      </div>
    </div>
  );
}

export default Products;
