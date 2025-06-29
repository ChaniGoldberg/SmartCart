import React, { useContext, useEffect } from 'react';
import {cartContext} from '../context/cartContext';


const TotalPrice: React.FC = () => {
    const context = useContext(cartContext); // Replace with your actual context if needed
    function sumTotalPrice() {
      // This function will sum the total price of all items
      return context.cartItems.reduce((total, item) => {
        return total + (item.ItemPrice * item.Quantity);
      }, 0);
    }
    const total = sumTotalPrice();
    
    return (
      <div style={{
                  marginLeft: '40%',
                  width:'20%',
                  padding: '8px 16px',
                  backgroundColor: 'green',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}>
        Total Price: {total}
      </div>
    );
};

export default TotalPrice;