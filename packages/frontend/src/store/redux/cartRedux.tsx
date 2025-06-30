import { Price } from "@smartcart/shared/src/prices";
import React, { Dispatch, SetStateAction } from 'react';

export type CartContextType = {
  cartItems: Price[];
  setCartItems: Dispatch<SetStateAction<Price[]>>;
};

export const cartContext = React.createContext<CartContextType>({
  cartItems: [],
  setCartItems: () => {},
});
