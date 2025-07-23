import React, { useState, ReactNode, useEffect } from 'react';
import { cartContext } from './cartRedux';
import { ProductDTO} from '@smartcart/shared';
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
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (item: ProductCartDTO, quantity: number = 1): void => {
    setCartItems(prevItems => {
      return prevItems.flatMap(cartItem => {
        if (cartItem.product.itemCode === item.product.itemCode) {
          const newQuantity = (cartItem.quantity || 0) - quantity;
          if (newQuantity > 0) {
            return [{ ...cartItem, quantity: newQuantity }];
          } else {
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
