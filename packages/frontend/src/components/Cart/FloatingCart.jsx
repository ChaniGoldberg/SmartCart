import React, {useContext} from "react";
import {cartContext} from "../../contexts/cartContext"; // נוודא שהנתיב נכון

export default function FloatingCart() {
  const {cartItems} = useContext(cartContext); 
  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.quantity * item.ItemPrice, 0)
    .toFixed(2);

  return (
    <div
      className="fixed top-5 left-5 flex items-center gap-3
                 bg-white shadow-md rounded-xl px-4 py-2
                 font-semibold cursor-pointer z-50"
    >
      <div className="relative">
        <span className="text-2xl">🛒</span>
        {itemsCount > 0 && (
          <span
            className="absolute -top-1 -right-2 bg-red-500 text-white text-xs
                       w-5 h-5 flex items-center justify-center rounded-full"
          >
            {itemsCount}
          </span>
        )}
      </div>
      <span className="text-sm">₪{totalPrice}</span>
    </div>
  );
}

