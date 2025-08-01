// ProductsView.tsx
import React, { useEffect, useState } from 'react';
import { fetchProducts, addProductToCart } from '../services/Apis';
import { formatCurrency } from './helpers';
import Cart from './cart';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Error loading products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (product: any) => {
    try {
      await addProductToCart(product.IdProducto);
      setCart((prev) => [...prev, product]);
    } catch (err) {
      setError('Error adding product to cart');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.IdProducto}>
            {product.vchNombreProducto} - {formatCurrency(product.Precio)}
            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
          </li>
        ))}
      </ul>
      <Cart cartItems={cart} />
    </div>
  );
};

export default Products;
