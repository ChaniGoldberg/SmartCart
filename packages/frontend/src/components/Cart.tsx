import React, { useContext, useState } from 'react';
import { cartContext } from '../store/redux/cartRedux';
import ProductDetails from './ProductDetails';
import '../index.css';
import '../App.css';
import CheapProductAlternatives from './AlternativeItemsList';
import { ShoppingCart, X } from 'lucide-react';
import ShareCartPopup from './ShareCartPopup'; // חדש
import ProductSearchComponent from './product-search-component';

const Cart: React.FC = () => {
  const context = useContext(cartContext);
    const [showPopup, setShowPopup] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false); // State for ProductSearchComponent
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
      <button
        onClick={() => setShowProductSearch(!showProductSearch)} // Toggle the ProductSearchComponent visibility
        className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
      >
        {showProductSearch ? 'סגור חיפוש מוצרים' : 'חיפוש מוצרים'} 
      </button>

      {showProductSearch && <div className="w-full">< ProductSearchComponent /></div>} {/* Conditionally render the component */}
     

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
       <button
        onClick={() => setShowPopup(true)}
  className="mt-10 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
      >
        שתף סל במייל
      </button>
  {showPopup && <ShareCartPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};
export default Cart;