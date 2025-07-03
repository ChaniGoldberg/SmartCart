import React, { useContext, useEffect } from 'react';
import {cartContext} from '../context/cartContext';


const TotalPrice: React.FC = () => {
    const context = useContext(cartContext); // Replace with your actual context if needed
    
    return (
      <div>
         {context && context.cartItems.reduce((total, item) => {
          return total + (item.ItemPrice * item.Quantity);  },0)}   
     </div>
    );
};

export default TotalPrice;