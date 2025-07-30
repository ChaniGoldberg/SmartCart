import { useContext, useEffect, useState } from "react";
import { cartContext } from "../store/redux/cartRedux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ProductSearchComponent from "./product-search-component";
import ProductDetails from "./ProductDetails";
import ShareCartPopup from "./ShareCartPopup";
const Cart: React.FC = () => {
  const context = useContext(cartContext);
  const [showPopup, setShowPopup] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (context && context.cartItems.length === 0) {
      context.setCartItems(cartItems);
    }
  }, [context]);

  if (!context) {
    throw new Error("Cart must be used within a CartProvider");
  }

  const { cartItems } = context;

  const handleCompare = () => {
    if (!cartItems || cartItems.length === 0) return;

    console.log("העברתי את המוצרים:", cartItems);  
    navigate('/compare', { state: { cartItems: cartItems } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingCart className="h-8 w-8 text-teal-600" />
        סל קניות
      </h1>

      {/* כפתורים בשורה אחת, בסדר הרצוי */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowProductSearch(!showProductSearch)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl shadow-md transition-all transform hover:scale-105"
        >
          {showProductSearch ? 'סגור חיפוש מוצרים' : 'חיפוש מוצרים'}
        </button>

        {cartItems?.length > 0 ? (
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl shadow-md transition-all transform hover:scale-105"
            onClick={handleCompare}
          >
            השווה
          </button>
        ) : (
          <p className="text-center text-gray-400 italic font-medium select-none">
            אין פריטים להשוואה
          </p>
        )}

        <button
          onClick={() => setShowPopup(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl shadow-md transition-all transform hover:scale-105"
        >
          שתף סל במייל
        </button>
      </div>

      {showProductSearch && <div className="w-full mt-6"><ProductSearchComponent /></div>}

      <main className="w-full max-w-6xl flex flex-col items-center mt-8">
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

      {showPopup && <ShareCartPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Cart;
