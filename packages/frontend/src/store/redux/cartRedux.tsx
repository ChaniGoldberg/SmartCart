import { ProductCartDTO } from "@smartcart/shared";
import React, { Dispatch, SetStateAction } from 'react';
export type CartContextType = {
  cartItems: ProductCartDTO[];
  setCartItems: React.Dispatch<React.SetStateAction<ProductCartDTO[]>>;
  addToCart: (item: ProductCartDTO, qtyToAdd?: number) => void;
  removeFromCart: (item: ProductCartDTO, qtyToRemove?: number) => void;
  removeToAllternative: (item: ProductCartDTO) => void;
};
export const cartContext = React.createContext<CartContextType>(
  {
    cartItems: [],
    setCartItems: function (value: React.SetStateAction<ProductCartDTO[]>): void {
      throw new Error("Function not implemented.");
    },
    addToCart: function (item: ProductCartDTO, qtyToAdd?: number): void {
      throw new Error("Function not implemented.");
    },
    removeFromCart: function (item: ProductCartDTO, qtyToRemove?: number): void {
      throw new Error("Function not implemented.");
    },
    removeToAllternative: function (item: ProductCartDTO): void {
      throw new Error("Function not implemented.");
    }
  }
);


