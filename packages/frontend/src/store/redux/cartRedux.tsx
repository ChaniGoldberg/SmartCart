import { ProductCartDTO } from "@smartcart/shared/src/dto/ProductCart.dto";
import React, { Dispatch, SetStateAction } from 'react';

export type CartContextType = {
  cartItems: ProductCartDTO[];
  setCartItems: React.Dispatch<React.SetStateAction<ProductCartDTO[]>>;
  addToCart: (item: ProductCartDTO, quantity?: number) => void;
  removeFromCart: (item: ProductCartDTO, quantity?: number) => void;
};

export const cartContext = React.createContext<CartContextType>({
  cartItems: [],
  setCartItems: () => { },
  addToCart: () => { },
  removeFromCart: () => { }
});



