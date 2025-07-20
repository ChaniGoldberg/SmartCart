// import React, { useState, useMemo } from "react";
// import { CartDTO } from "@smartcart/shared/src/dto/Cart.dto";
// import { ProductDTO } from "@smartcart/shared/src/dto/Product.dto";
// import MainLayout from '../layout/MainLayout';
// import { ProductCartDTO } from "@smartcart/shared/src/dto/ProductCart.dto";

// // מערך הסלים לדוגמה
// const carts: CartDTO[] = [];

// const CartComparison = () => {
//   const [selectedProducts, setSelectedProducts] = useState<ProductCartDTO[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedCartIndex, setSelectedCartIndex] = useState<number | null>(null);

//   // 💡 חישוב סכום של כל סל רק פעם אחת אלא אם carts משתנה
//   const totals = useMemo(() => {
//     return carts.map(cart =>
//       cart.products.reduce((sum, p) => sum + p.product.price, 0)
//     );
//   }, [carts]);

//   // 💡 חישוב הסל הכי יקר
//   const maxTotal = useMemo(() => {
//     return totals.length > 0 ? Math.max(...totals) : 0;
//   }, [totals]);

//   const openPopup = (products: ProductCartDTO[], index: number) => {
//     setSelectedProducts(products);
//     setSelectedCartIndex(index);
//     setIsOpen(true);
//   };

//   const closePopup = () => {
//     setIsOpen(false);
//     setSelectedCartIndex(null);
//   };

//   // מונע מהקליק בתוך הפופאפ לסגור אותו
//   const stopPropagation = (e: React.MouseEvent) => {
//     e.stopPropagation();
//   };

//   return (
//     <MainLayout>
//       <div className="w-full flex flex-col items-center mt-8">

//         {/* כותרת עמוד */}
//         <h2 className="text-2xl font-bold mb-8 mt-8 text-[#08857D]">השוואת סלים</h2>

//         {/* טבלת הסלים */}
//         <div className="overflow-x-auto w-full max-w-4xl">
//           <table className="min-w-full bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
//             <thead>
//               <tr className="bg-[#f5fafd]">
//                 <th className="py-3 px-4 font-semibold text-[#08857D] text-right">שם</th>
//                 <th className="py-3 px-4 font-semibold text-[#08857D] text-right">כתובת</th>
//                 <th className="py-3 px-4 font-semibold text-[#08857D] text-center">מוצרים</th>
//                 <th className="py-3 px-4 font-semibold text-[#08857D] text-center">סה"כ</th>
//                 <th className="py-3 px-4 font-semibold text-[#08857D] text-center">חיסכון</th>
//               </tr>
//             </thead>
//             <tbody>
//               {carts.map((cart, idx) => (
//                 <tr
//                   key={idx}
//                   className={`hover:bg-gray-50 transition ${
//                     selectedCartIndex === idx ? 'bg-[#e6fafa] border-2 border-[#0db0a5]' : ''
//                   }`}
//                 >
//                   <td className="py-2 px-4 border-t font-bold text-gray-700 text-right">
//                     {cart.storeName}
//                   </td>
//                   <td className="py-2 px-4 border-t text-gray-700 text-right">
//                     {cart.address}
//                   </td>
//                   <td className="py-2 px-4 border-t text-center">
//                     <button
//                       onClick={() => openPopup(cart.products, idx)}
//                       className="text-[#08857D] hover:underline"
//                     >
//                       הצג מוצרים
//                     </button>
//                   </td>
//                   <td className="py-2 px-4 border-t text-center text-green-500 font-semibold">
//                     {totals[idx].toFixed(2)} ₪
//                   </td>
//                   <td className="py-2 px-4 border-t text-center text-gray-700">
//                     {(maxTotal - totals[idx]).toFixed(2)} ₪
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* פופאפ הצגת מוצרים */}
//         {isOpen && selectedCartIndex !== null && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 cursor-pointer"
//             onClick={closePopup}
//           >
//             <div
//               className="bg-white p-6 rounded-xl shadow-lg border-4 border-[#08857D] w-96 max-h-[80vh] overflow-auto relative cursor-auto"
//               onClick={stopPropagation}
//             >
//               {/* כפתור סגירה X */}
//               <button
//                 onClick={closePopup}
//                 className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl leading-none"
//                 aria-label="Close"
//               >
//                 &times;
//               </button>

//               {/* כותרת הפופאפ - בדיקה אם storeName קיים */}
//               <h3 className="text-xl font-bold mb-4 text-[#08857D] text-center">
//                 {selectedCartIndex !== null && carts[selectedCartIndex]?.storeName &&
//                   `הסל ב־${carts[selectedCartIndex].storeName}`}
//               </h3>

//               {/* רשימת המוצרים */}
//               <ul className="space-y-2">
//                 {selectedProducts.map((product, index) => (
//                   <li key={index} className="flex justify-between border-b pb-1 text-sm text-gray-700">
//                     <span className="text-green-500 font-semibold">
//                       {product.product.price.toFixed(2)} ₪
//                     </span>
//                     <span>{product.product.ProductName}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// };

// export default CartComparison;



import React, { useState, useMemo } from "react";
import { CartDTO } from "@smartcart/shared/src/dto/Cart.dto";
import { ProductDTO } from "@smartcart/shared/src/dto/Product.dto";
import MainLayout from '../layout/MainLayout';
import { ProductCartDTO } from "@smartcart/shared/src/dto/ProductCart.dto";

// מערך הסלים לדוגמה
const carts: CartDTO[] = [];

// סל המשתמש - זה צריך להגיע כ-prop או מה-context
const userCart: ProductCartDTO[] = []; // זה צריך להיות הסל של המשתמש

const CartComparison = () => {
  const [selectedProducts, setSelectedProducts] = useState<ProductCartDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCartIndex, setSelectedCartIndex] = useState<number | null>(null);
  const [showingMissingProducts, setShowingMissingProducts] = useState(false);

  // 💡 חישוב סכום של כל סל רק פעם אחת אלא אם carts משתנה
  const totals = useMemo(() => {
    return carts.map(cart =>
      cart.products.reduce((sum, p) => sum + p.product.price, 0)
    );
  }, [carts]);

  // 💡 חישוב הסל הכי יקר
  const maxTotal = useMemo(() => {
    return totals.length > 0 ? Math.max(...totals) : 0;
  }, [totals]);

  // 💡 חישוב מוצרים חסרים בכל סל ביחס לסל המשתמש
  const missingProducts = useMemo(() => {

    return carts.map((cart) => {
      const storeProductIds = cart.products.map(p => p.product.itemCode);
      const missingInThisStore: ProductDTO[] = [];

      // מצא מוצרים שקיימים בסל המשתמש אבל לא בסל של החנות
      userCart.forEach(userProduct => {
        if (!storeProductIds.includes(userProduct.product.itemCode)) {
          missingInThisStore.push(userProduct.product);
        }
      });

      return missingInThisStore;
    });
  }, [carts, userCart]);

  const openPopup = (products: ProductCartDTO[], index: number) => {
    setSelectedProducts(products);
    setSelectedCartIndex(index);
    setShowingMissingProducts(false);
    setIsOpen(true);
  };

  const openMissingProductsPopup = (products: ProductDTO[], index: number) => {
    // המרה של ProductDTO[] ל-ProductCartDTO[]
    const convertedProducts: ProductCartDTO[] = products.map(product => ({
      product: product,
      quantity: 1 // כמות ברירת מחדל
    }));

    setSelectedProducts(convertedProducts);
    setSelectedCartIndex(index);
    setShowingMissingProducts(true);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setSelectedCartIndex(null);
    setShowingMissingProducts(false);
  };

  // מונע מהקליק בתוך הפופאפ לסגור אותו
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <MainLayout>
      <div className="w-full flex flex-col items-center mt-8">

        {/* כותרת עמוד */}
        <h2 className="text-2xl font-bold mb-8 mt-8 text-[#08857D]">השוואת סלים</h2>

        {/* טבלת הסלים */}
        <div className="overflow-x-auto w-full max-w-6xl">
          <table className="min-w-full bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <thead>
              <tr className="bg-[#f5fafd]">
                <th className="py-3 px-4 font-semibold text-[#08857D] text-right">שם</th>
                <th className="py-3 px-4 font-semibold text-[#08857D] text-right">כתובת</th>
                <th className="py-3 px-4 font-semibold text-[#08857D] text-center">מוצרים</th>
                <th className="py-3 px-4 font-semibold text-[#08857D] text-center">מוצרים שחסרים</th>
                <th className="py-3 px-4 font-semibold text-[#08857D] text-center">סה"כ</th>
                <th className="py-3 px-4 font-semibold text-[#08857D] text-center">חיסכון</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-gray-50 transition ${selectedCartIndex === idx ? 'bg-[#e6fafa] border-2 border-[#0db0a5]' : ''
                    }`}
                >
                  <td className="py-2 px-4 border-t font-bold text-gray-700 text-right">
                    {cart.storeName}
                  </td>
                  <td className="py-2 px-4 border-t text-gray-700 text-right">
                    {cart.address}
                  </td>
                  <td className="py-2 px-4 border-t text-center">
                    <button
                      onClick={() => openPopup(cart.products, idx)}
                      className="text-[#08857D] hover:underline"
                    >
                      הצג מוצרים
                    </button>
                  </td>
                  <td className="py-2 px-4 border-t text-center">
                    {missingProducts[idx].length > 0 ? (
                      <button
                        onClick={() => openMissingProductsPopup(missingProducts[idx], idx)}
                        className="text-red-500 hover:underline"
                      >
                        הצג חסרים ({missingProducts[idx].length})
                      </button>
                    ) : (
                      <span className="text-green-500">הכל קיים</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-t text-center text-green-500 font-semibold">
                    {totals[idx].toFixed(2)} ₪
                  </td>
                  <td className="py-2 px-4 border-t text-center text-gray-700">
                    {(maxTotal - totals[idx]).toFixed(2)} ₪
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* פופאפ הצגת מוצרים */}
        {isOpen && selectedCartIndex !== null && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 cursor-pointer"
            onClick={closePopup}
          >
            <div
              className={`bg-white p-6 rounded-xl shadow-lg border-4 w-96 max-h-[80vh] overflow-auto relative cursor-auto ${showingMissingProducts ? 'border-red-500' : 'border-[#08857D]'
                }`}
              onClick={stopPropagation}
            >
              {/* כפתור סגירה X */}
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>

              {/* כותרת הפופאפ */}
              <h3 className={`text-xl font-bold mb-4 text-center ${showingMissingProducts ? 'text-red-500' : 'text-[#08857D]'
                }`}>
                {selectedCartIndex !== null && carts[selectedCartIndex]?.storeName &&
                  `${showingMissingProducts ? 'מוצרים שחסרים ב־' : 'הסל ב־'}${carts[selectedCartIndex].storeName}`}
              </h3>

              {/* רשימת המוצרים */}
              <ul className="space-y-2">
                {selectedProducts.map((product, index) => (
                  <li key={index} className={`flex justify-between border-b pb-1 text-sm text-gray-700 ${showingMissingProducts ? 'bg-red-50' : ''
                    }`}>
                    <span className={`font-semibold ${showingMissingProducts ? 'text-red-500' : 'text-green-500'
                      }`}>
                      {product.product.price.toFixed(2)} ₪
                    </span>
                    <span>{product.product.ProductName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartComparison;