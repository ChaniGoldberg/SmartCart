import React, { useState } from "react";
import { CartComparisonDTO } from "@smartcart/shared/DTO/CartComparison.dto";
import { ProductDTO } from "@smartcart/shared/DTO/Product.dto";
import { Link } from "react-router-dom";

const carts: CartComparisonDTO[] = [];

const totals = carts.map(cart => cart.products.reduce((sum, p) => sum + p.price, 0));
const maxTotal = Math.max(...totals);

const CartComparison = () => {
  const [selectedProducts, setSelectedProducts] = useState<ProductDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = (products: ProductDTO[]) => {
    setSelectedProducts(products);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full flex flex-col items-center mt-8">
      <div className="flex gap-2 absolute top-4 left-4 z-50">
        <span className="w-3 h-3 rounded-full bg-red-400 border border-red-300 shadow-sm"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-200 shadow-sm"></span>
        <span className="w-3 h-3 rounded-full bg-green-400 border border-green-300 shadow-sm"></span>
      </div>
      <header className="w-full bg-gradient-to-br from-[#08857d] to-[#0db0a5] text-white py-4 px-6 mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">🛒</span>
          <span className="text-2xl font-bold">SmartShop</span>
        </div>
        <nav className="flex gap-6 text-base">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/map" className="hover:underline">Map</Link>
          <Link to="/" className="hover:underline">Shopping Cart</Link>
          <Link to="/" className="hover:underline">Log in</Link>
        </nav>
      </header>
      <h2 className="text-2xl font-bold mb-8 mt-8 text-gray-800">השוואת סלים</h2>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
          <thead>
            <tr className="bg-[#f5fafd]">
              <th className="py-3 px-4 font-semibold text-gray-700">שם</th>
              <th className="py-3 px-4 font-semibold text-gray-700">כתובת</th>
              <th className="py-3 px-4 font-semibold text-gray-700">מוצרים</th>
              <th className="py-3 px-4 font-semibold text-gray-700">סה"כ</th>
              <th className="py-3 px-4 font-semibold text-gray-700">חיסכון</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-t font-bold">{cart.storeName}</td>
                <td className="py-2 px-4 border-t">{cart.address}</td>
                <td className="py-2 px-4 border-t text-center">
                  <button onClick={() => openPopup(cart.products)} className="text-blue-500 hover:underline">
                    הצג מוצרים
                  </button>
                </td>
                <td className="py-2 px-4 border-t text-center">
                  {cart.products.reduce((sum, p) => sum + p.price, 0).toFixed(2)} ₪
                </td>
                <td className="py-2 px-4 border-t text-center">
                  {(maxTotal - totals[idx]).toFixed(2)} ₪
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">פרטי המוצרים</h3>
            <ul>
              {selectedProducts.map((product, index) => (
                <li key={index} className="flex justify-between">
                  
                  <span>{product.price} ₪</span>
                  <span>{product.ProductName}</span>
                </li>
              ))}
            </ul>
            <button onClick={closePopup} className="mt-4 text-red-500">
              חזור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartComparison;
