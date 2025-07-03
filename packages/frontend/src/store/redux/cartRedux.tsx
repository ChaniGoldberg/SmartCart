import { Price } from "@smartcart/shared/src/price";
import React, { Dispatch, SetStateAction } from 'react';

export type CartContextType = {
  cartItems: Price[];
  setCartItems: Dispatch<SetStateAction<Price[]>>;
  addToCart: (item: Price, quantity?: number) => void;
  removeFromCart: (item: Price, quantity?: number) => void;
};

export const cartContext = React.createContext<CartContextType>({
  cartItems: [],
  setCartItems: () => {},
  addToCart: () => {},          
  removeFromCart: () => {}
});
