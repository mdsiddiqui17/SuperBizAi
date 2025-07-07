import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/OrdersTab.css';

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', product: '', unitPrice: '', quantity: 1 });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchBusinessProfile();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
    }
  };

  const fetchBusinessProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/content/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('❌ Error fetching business products:', err);
    }
  };

  const handleSearch = () => {
    const query = search.toLowerCase();
    const filteredList = orders.filter(order =>
      order.orderNumber.toLowerCase().includes(query) ||
      order.name.toLowerCase().includes(query) ||
      order.products.some(p => p.name.toLowerCase().includes(query))
    );
    setFiltered(filteredList);
  };

  const exportCSV = () => {
    const headers = ['Order Number', 'Name', 'Email', 'Phone', 'Product', 'Unit Price', 'Quantity', 'Total'];
    const rows = filtered.map(order => {
      const p = order.products[0];
      return [
        order.orderNumber,
        order.name,
        order.email,
        order.phone,
        p?.name || '',
        `$${p?.unitPrice || ''}`,
        p?.quantity || '',
        `$${(p?.unitPrice || 0) * (p?.quantity || 1)}`
      ];
    });
    const content = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const selected = products.find(p => p.name === form.product);
    const unitPrice = selected?.price || 0;

    const productObj = {
      name: form.product,
      unitPrice,
      quantity: parseInt(form.quantity)
    };

    const total = productObj.unitPrice * productObj.quantity;

    const orderData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      orderNumber: isEditing ? undefined : 'ORD-' + Date.now(),
      products: [productObj],
      total
    };

    try {
      if (isEditing) {
        await axios.put(`/api/orders/${editingId}`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/orders', orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      resetForm();
      fetchOrders();
    } catch (err) {
      console.error('Error saving order:', err);
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', product: '', unitPrice: '', quantity: 1 });
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (order) => {
    const p = order.products[0];
    setForm({
      name: order.name,
      email: order.email,
      phone: order.phone,
      product: p?.name,
      unitPrice: p?.unitPrice,
      quantity: p?.quantity
    });
    setIsEditing(true);
    setEditingId(order._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrders();
      } catch (err) {
        console.error('❌ Error deleting order:', err);
      }
    }
  };

  const handleProductSelect = (productName) => {
    const selected = products.find(p => p.name === productName);
    setForm({ ...form, product: productName, unitPrice: selected?.price || '' });
  };

  return (
    <div className="orders-tab">
      <h2>Orders</h2>
      <div className="order-controls">
        <input type="text" placeholder="Search by name, product, or order number" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => setFiltered(orders)}>View All</button>
        <button onClick={exportCSV}>Export CSV</button>
        <button className="add-btn" onClick={() => setShowModal(true)}>Add Order</button>
      </div>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order #</th><th>Name</th><th>Email</th><th>Phone</th><th>Product</th><th>Unit Price</th><th>Qty</th><th>Total</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(order => {
            const p = order.products[0];
            const total = p ? p.unitPrice * p.quantity : 0;
            return (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.name}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{p?.name}</td>
                <td>${p?.unitPrice}</td>
                <td>{p?.quantity}</td>
                <td>${total}</td>
                <td>
                  <button onClick={() => handleEdit(order)}>Edit</button>
                  <button onClick={() => handleDelete(order._id)} style={{ marginLeft: '5px' }}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <form className="modal-form" onSubmit={handleSubmit}>
            <h3>{isEditing ? 'Edit Order' : 'Add Order'}</h3>
            <input placeholder="Customer Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <select value={form.product} onChange={e => handleProductSelect(e.target.value)} required>
              <option value="">Select Product</option>
              {products.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
            </select>
            <input type="number" placeholder="Quantity" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <input placeholder="Unit Price" value={form.unitPrice} readOnly />
            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
