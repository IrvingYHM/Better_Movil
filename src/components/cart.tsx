import React from 'react';
import { formatCurrency } from './helpers';

interface CartProps {
  cartItems: any[];
}

const Cart: React.FC<CartProps> = ({ cartItems }) => {
  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - {formatCurrency(item.price)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
