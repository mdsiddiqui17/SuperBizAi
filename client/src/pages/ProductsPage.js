
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SmartProductForm from '../components/SmartProductForm';
import '../styles/ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Smart Products</h2>
      <SmartProductForm onSuccess={fetchProducts} />

      <div className="row mt-4">
        {products.length === 0 ? (
          <p>No products yet. Add one above.</p>
        ) : (
          products.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className="card h-100 shadow-sm">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p>{product.description}</p>
                  {product.tags?.length > 0 && (
                    <p><small>Tags: {product.tags.join(', ')}</small></p>
                  )}
                </div>
                <div className="card-footer d-flex justify-content-end">
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
