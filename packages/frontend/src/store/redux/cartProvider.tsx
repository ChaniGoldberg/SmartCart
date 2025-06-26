import React, { useState, ReactNode } from 'react';
import { Price } from "@smartcart/shared/src/prices";
import { cartContext } from './cartRedux';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Price[]>([]);

  return (
    <cartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </cartContext.Provider>
  );
};