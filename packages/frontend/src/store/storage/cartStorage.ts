import { useContext, useEffect } from "react";
import { cartContext } from '../redux/cartRedux';


export const saveToCartStorage = (cart:any) => {
  localStorage.setItem('cart', JSON.stringify(cart.cartItems));
};

export const loadFromCartStorage = () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            return []; 
        }
    }
    return [];
};