import React, { useEffect, useState, useMemo } from "react";
import { CartDTO, ProductCartDTO, ProductDTO } from "@smartcart/shared";
import MainLayout from "../layout/MainLayout";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useUserLocation } from "../hooks/useUserLocation";

const CartComparison = () => {
  const location = useLocation();
  const { cartItems }: { cartItems: ProductCartDTO[] } = location.state || { cartItems: [] };
  const [comparisonResults, setComparisonResults] = useState<CartDTO[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false); 
  const [viewMode, setViewMode] = useState<'default' | 'alternate'>('default'); 
  const { latitude, longitude, loading: locationLoading, error: locationError } = useUserLocation(); 
  const [userCart, setUserCart] = useState<CartDTO | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<ProductCartDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCartIndex, setSelectedCartIndex] = useState<number | null>(null);
  const [showingMissingProducts, setShowingMissingProducts] = useState(false);
  const [showTableView, setShowTableView] = useState(false);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!cartItems || !latitude || !longitude) return;
      setLoading(true); // מתחילים טעינה
      try {
        const response = await axios.post('/api/cart/compare', {
          location: { latitude, longitude, loading: locationLoading, error: locationError },
          userCart: cartItems
        });
        setComparisonResults(response.data);
        setError(null);
      } catch (err: any) {
        console.error('שגיאה:', err);
        setError('אירעה שגיאה בעת השוואת המחירים');
      } finally {
        setLoading(false); // סיימו טעינה
      }
    };
    fetchComparison();
  }, [cartItems, latitude, longitude, locationLoading, locationError]);

  const totals = useMemo(() => comparisonResults.map(cart => cart.totalPrice), [comparisonResults]);
  const maxTotal = useMemo(() => (totals.length > 0 ? Math.max(...totals) : 0), [totals]);
  const missingProducts = useMemo(() => {
    if (!userCart || !userCart.products) return comparisonResults.map(() => []);
    return comparisonResults.map(cart => {
      const storeProductIds = cart.products.map(p => p.product.itemCode);
      return userCart.products
        .filter(userProduct => !storeProductIds.includes(userProduct.product.itemCode))
        .map(userProduct => userProduct.product);
    });
  }, [comparisonResults, userCart]);

  const openPopup = (products: ProductCartDTO[], index: number) => {
    setSelectedProducts(products);
    setSelectedCartIndex(index);
    setShowingMissingProducts(false);
    setIsOpen(true);
  };

  const openMissingProductsPopup = (products: ProductDTO[], index: number) => {
    const converted: ProductCartDTO[] = products.map(p => ({ product: p, quantity: 1 }));
    setSelectedProducts(converted);
    setSelectedCartIndex(index);
    setShowingMissingProducts(true);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setSelectedCartIndex(null);
    setShowingMissingProducts(false);
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <MainLayout>
      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 mt-2 text-[#08857D]">השוואת סלים</h2>
        <button
          onClick={() => setViewMode(viewMode === "default" ? "alternate" : "default")}
          className="bg-[#08857D] hover:bg-[#066C65] text-white font-bold py-2 px-4 rounded-xl shadow"
        >
          {viewMode === "default" ? "עבור לתצוגת טבלה" : "עבור לתצוגת כרטיסים"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-8">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-4 border-[#08857D]" />
          <span className="ml-4 text-lg">טוען נתונים...</span>
        </div>
      ) : (
        <div>
          {viewMode === "default" ? (
            <div className="w-full flex flex-col items-center mt-8">
              <div className="overflow-y-auto max-h-[75vh] w-full px-4" dir="ltr">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto" dir="rtl">
                  {comparisonResults.map((cart, idx) => {
                    const userItemCodes = new Set(
                      (userCart?.products || []).map(p => String(p.product.itemCode).trim())
                    );
                    return (
                      <div key={idx} className="bg-white rounded-xl shadow border border-gray-200 p-4 space-y-3">
                        <div className="text-xl font-bold text-[#08857D] text-right">{cart.storeName}</div>
                        <div className="text-sm text-gray-600 text-right">{cart.address}</div>
                        <div className="overflow-y-auto max-h-64 pr-1">
                          {(() => {
                            const storeItemCodes = new Set(cart.products.map(p => String(p.product.itemCode).trim()));
                            const userItems = userCart?.products || [];
                            const allProducts = [
                              ...cart.products.map(p => ({ ...p, isMissing: false })),
                              ...userItems
                                .filter(up => !storeItemCodes.has(String(up.product.itemCode).trim()))
                                .map(up => ({ ...up, isMissing: true }))
                            ];
                            return allProducts.map((p, i) => (
                              <li
                                key={i}
                                className={`flex justify-between items-center border-b pb-1 ${p.isMissing ? "text-red-500 line-through" : ""}`}
                              >
                                 <span className="text-right">{p.quantity}</span>
                                <span className="text-right">{p.product.itemName}</span>
                                <span className="text-left">{p.product.price.toFixed(2)} ₪</span>

                              </li>
                            ));
                          })()}
                        </div>
                        <div className="flex justify-between pt-2 font-bold text-sm border-t text-gray-700">
                          <span className="text-right">סה״כ: {cart.totalPrice.toFixed(2)} ₪</span>
                          <span className="text-left text-green-600">חיסכון: {(maxTotal - cart.totalPrice).toFixed(2)} ₪</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full max-w-6xl mx-auto">
              <table className="min-w-full bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                <thead>
                  <tr className="bg-[#F5FAFD]">
                    <th className="py-3 px-4 font-semibold text-[#08857D] text-center">חיסכון</th>
                    <th className="py-3 px-4 font-semibold text-[#08857D] text-center">סה"כ</th>
                    <th className="py-3 px-4 font-semibold text-[#08857D] text-center">מוצרים חסרים</th>
                    <th className="py-3 px-4 font-semibold text-[#08857D] text-center">מוצרים</th>
                    <th className="py-3 px-4 font-semibold text-[#08857D] text-right">כתובת</th>
                    <th className="py-3 px-4 font-semibold text-[#08857D] text-right">שם</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonResults.map((cart, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 transition ${selectedCartIndex === idx ? 'bg-[#E6FAFA] border-2 border-[#0DB0A5]' : ''}`}>
                      <td className="py-2 px-4 border-t text-center text-gray-700">
                        {(maxTotal - totals[idx]).toFixed(2)} ₪
                      </td>
                      <td className="py-2 px-4 border-t text-center text-green-500 font-semibold">
                        {totals[idx].toFixed(2)} ₪
                      </td>
                      <td className="py-2 px-4 border-t text-center">
                        {missingProducts[idx].length > 0 ? (
                          <button onClick={() => openMissingProductsPopup(missingProducts[idx], idx)} className="text-red-500 hover:underline">
                            חסרים ({missingProducts[idx].length})
                          </button>
                        ) : (
                          <span className="text-green-500">הכל קיים</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-t text-center">
                        <button onClick={() => openPopup(cart.products, idx)} className="text-[#08857D] hover:underline">הצג</button>
                      </td>
                      <td className="py-2 px-4 border-t text-gray-700 text-right">{cart.address}</td>
                      <td className="py-2 px-4 border-t font-bold text-gray-700 text-right">{cart.storeName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {isOpen && selectedCartIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 cursor-pointer" onClick={closePopup}>
          <div
            className={`bg-white p-6 rounded-xl shadow-lg border-4 w-96 max-h-[80vh] overflow-auto relative cursor-auto ${showingMissingProducts ? 'border-red-500' : 'border-[#08857D]'}`}
            onClick={stopPropagation}
          >
            <button onClick={closePopup} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl leading-none">&times;</button>
            <h3 className={`text-xl font-bold mb-4 text-center ${showingMissingProducts ? 'text-red-500' : 'text-[#08857D]'}`}>
              {selectedCartIndex !== null && comparisonResults[selectedCartIndex]?.storeName &&
                `${showingMissingProducts ? 'חסרים ב־' : 'מוצרים ב־'}${comparisonResults[selectedCartIndex].storeName}`}
            </h3>
            <ul className="space-y-2">
              {selectedProducts.map((product, index) => (
                <li key={index} className={`flex justify-between border-b pb-1 text-sm text-gray-700 ${showingMissingProducts ? 'bg-red-50' : ''}`}>
                  <span className={`font-semibold ${showingMissingProducts ? 'text-red-500' : 'text-green-500'}`}>
                    {product.product.price.toFixed(2)} ₪
                  </span>
                  <span>{product.product.ProductName}</span>
                  <span>{product.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default CartComparison;
