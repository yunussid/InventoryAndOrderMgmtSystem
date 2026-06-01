import React, { useState, useEffect } from 'react';
import api from '../api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '' });
  const [message, setMessage] = useState(null);

  const fetchCustomers = () => api.get('/customers').then(res => setCustomers(res.data)).catch(console.error);

  useEffect(() => { fetchCustomers(); }, []);

  const showMessage = (text, type) => { setMessage({ text, type }); setTimeout(() => setMessage(null), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone_number) {
      showMessage('All fields are required', 'error'); return;
    }
    try {
      await api.post('/customers', form);
      showMessage('Customer created successfully', 'success');
      setForm({ full_name: '', email: '', phone_number: '' });
      fetchCustomers();
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Error creating customer', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try { await api.delete(`/customers/${id}`); showMessage('Customer deleted', 'success'); fetchCustomers(); }
    catch (err) { showMessage(err.response?.data?.detail || 'Error deleting', 'error'); }
  };

  return (
    <div>
      <div className="section">
        <h2>Add Customer</h2>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Full Name</label><input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="form-group"><label>Phone Number</label><input value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} /></div>
          </div>
          <button className="btn btn-primary" type="submit">Add Customer</button>
        </form>
      </div>
      <div className="section">
        <h2>Customers List</h2>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.full_name}</td><td>{c.email}</td><td>{c.phone_number}</td>
                <td><button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p style={{marginTop:15, color:'#999'}}>No customers yet.</p>}
      </div>
    </div>
  );
}

export default Customers;
