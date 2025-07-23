import { useContext, useEffect } from "react";
import { cartContext } from '../redux/cartRedux';


export const saveToCartStorage = (cart:any) => {
  localStorage.setItem('cart', JSON.stringify(cart.cartItems));
};

export const loadFromCartStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : null;
};