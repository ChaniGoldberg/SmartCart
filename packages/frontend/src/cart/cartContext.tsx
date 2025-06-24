import {Price} from "../../../shared/src/prices"
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type CartContextType = {
  cartItems: Price[];
  setCartItems: Dispatch<SetStateAction<Price[]>>;
};

export const cartContext = createContext<CartContextType>({
  cartItems:[],
  setCartItems: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Price[]>([]);

  return (
    <cartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </cartContext.Provider>
  );
};
