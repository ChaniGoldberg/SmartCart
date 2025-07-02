import React, { useState, ReactNode } from 'react';
import { cartContext } from './cartRedux';
import { Price } from '@smartcart/shared/src/price';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Price[]>([]);

  const addToCart = (item: Price, quantity: number = 1): void =>{

    setCartItems(prevItems => {
      const existing = prevItems.find(cartItem => cartItem.itemId === item.itemId);
      if (existing) {
        // אם קיים, עדכן את הכמות
        return prevItems.map(cartItem =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, quantity: (cartItem.quantity || 0) + quantity }
            : cartItem
        );
      } else {
        // אם לא קיים, הוסף עותק חדש עם הכמות המבוקשת
        return [...prevItems, { ...item, quantity }];
      }
    });
  }


const removeFromCart = (item: Price, quantity: number = 1): void => {
  setCartItems(prevItems => {
    return prevItems.flatMap(cartItem => {
      if (cartItem.itemId === item.itemId) {
        const newQuantity = (cartItem.quantity || 0) - quantity;
        if (newQuantity > 0) {
          // עדכן כמות
          return [{ ...cartItem, quantity: newQuantity }];
        } else {
          // הסר מהסל
          return [];
        }
      }
      return [cartItem];
    });
  });
};

return (
  <cartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart }}>
    {children}
  </cartContext.Provider>
);
};