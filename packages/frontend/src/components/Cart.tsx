import React, { useContext } from 'react';
import { cartContext } from '../store/redux/cartRedux';
import ProductDetails from './ProductDetails';
import '../index.css';
import '../App.css';
import CheapProductAlternatives from './AlternativeItemsList';
import { ShoppingCart } from 'lucide-react';
const Cart: React.FC = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("Cart must be used within a CartProvider");
  }
  const { cartItems } = context;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      {/* <header className="bg-[#23262B] py-10 mb-10 w-full">
        <h1 className="text-5xl font-extrabold text-center text-white tracking-tight">Cart</h1>
      </header> */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingCart className="h-8 w-8 text-teal-600" />
        סל קניות
      </h1>

      <main className="w-full max-w-6xl flex flex-col items-center">
        <h2 className="text-2xl mb-8 text-gray-800 text-right w-full "> ({cartItems.length}):כמות פריטים בסל</h2>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-xl">הסל ריק</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {cartItems.map((item) => (
              <ProductDetails key={item.product.itemCode} productCart={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default Cart;