import React, { useState, ReactNode, useEffect } from 'react';
import { cartContext } from './cartRedux';
import { Price } from '@smartcart/shared/src/price';
import { ProductCartDTO } from '@smartcart/shared/src/dto/ProductCart.dto';
import { loadFromCartStorage, saveToCartStorage } from '../storage/cartStorage';

export const CartProvider = ({ children }: { children: ReactNode }) => {
   
  const [cartItems, setCartItems] = useState<ProductCartDTO[]>(loadFromCartStorage());
  useEffect(() => {
    saveToCartStorage(cartItems);
  }, [cartItems]);



  const addToCart = (item: ProductCartDTO, qtyToAdd: number = 1): void => {
    setCartItems(prevItems => {
      const existing = prevItems.find(cartItem => cartItem.product.itemCode === item.product.itemCode);
      if (existing) {
        return prevItems.map(cartItem =>
          cartItem.product.itemCode === item.product.itemCode
            ? { ...cartItem, quantity: (cartItem.quantity || 0) + qtyToAdd }
            : cartItem
        );
      } else {
        // אם לא קיים, הוסף עותק חדש עם הכמות המבוקשת
        return [...prevItems, { ...item, quantity: qtyToAdd }];
      }
    });
  };
  const removeFromCart = (item: ProductCartDTO, qtyToRemove: number = 1): void => {
    setCartItems(prevItems => {
      return prevItems.flatMap(cartItem => {
        if (cartItem.product.itemCode === item.product.itemCode) {
          const newQuantity = (cartItem.quantity || 0) - qtyToRemove;
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
    <cartContext.Provider value={{
      cartItems, setCartItems, addToCart, removeFromCart, removeToAllternative(item) {
      },
    }}>
      {children}
    </cartContext.Provider>
  );
};

