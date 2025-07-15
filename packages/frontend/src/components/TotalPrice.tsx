import React, { useContext, useEffect } from 'react';
import {cartContext} from 'frontend/src/store/redux/cartRedux';


const TotalPrice: React.FC = () => {
    const context = useContext(cartContext); // Replace with your actual context if needed
    
    return (
      <div>
         {context && context.cartItems.length>0 && context.cartItems.reduce((total, item) => {
          return total + (item.product.price * item.quantity);  },0)}   
     </div>
    );
};

export default TotalPrice;