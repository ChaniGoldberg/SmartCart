import React, { useContext } from 'react';
import { cartContext } from '../store/redux/cartRedux';
import '../index.css'; 
import '../App.css'; 
const Cart = () => {
  const context = useContext(cartContext);


  if (!context) {
    throw new Error("Cart must be used within a CartProvider");
  }

  const { cartItems } = context;

  return (
    <div className="Cart">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-[#23262b] py-10 mb-10">
          <h1 className="text-5xl font-extrabold text-center text-white tracking-tight ">Cart</h1>
        </header>
        <main className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-left">Items ({cartItems.length})</h2>
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-400 py-20 text-xl">Your cart is empty</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cartItems.map((item) => (
                  <div
                    key={item.ItemId}
                    className="bg-white rounded-lg shadow p-8 flex flex-col items-center border hover:shadow-lg transition"
                  >
                    <div className="text-2xl font-bold mb-2 text-center">{item.ItemName}</div>
                    <div className="text-gray-800 mb-1 text-center">
                      <span className="font-semibold">Type:</span> {item.Category}
                    </div>
                    <div className="text-gray-800 mb-1 text-center">
                      <span className="font-semibold">Amount:</span> ${item.ItemPrice}
                    </div>
                    <div className="text-gray-500 text-xs mb-2 text-center">ID: {item.ItemId}</div>
                    <div className="text-sm text-gray-500 text-center">{item.ManufacturerName} | {item.ManufactureCountry}</div>
                    <div className="text-xs text-gray-400 mt-2 text-center">{item.ManufacturerItemDescription}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cart;














