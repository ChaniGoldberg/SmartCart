import React, { useContext, useEffect } from 'react';
import {cartContext} from '../contexts/cartContext';


const TotalPrice: React.FC = () => {
    const context = useContext(cartContext); // Replace with your actual context if needed
    
    return (
      <div>
         {context && context.cartItems.length>0 && context.cartItems.reduce((total, item) => {
          return total + (item.price * item.quantity);  },0)}   
     </div>
    );
};

export default TotalPrice;