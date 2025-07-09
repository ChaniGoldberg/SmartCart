import React, { useState } from "react";
import { CartDTO } from "@smartcart/shared/src/dto/Cart.dto";
import { ProductDTO } from "@smartcart/shared/src/dto/Product.dto";
import MainLayout from '../layout/MainLayout';

const carts: CartDTO[] = [];

const CartComparison = () => {
  // מצבים לניהול רכיבי הממשק:
  const [selectedProducts, setSelectedProducts] = useState<ProductDTO[]>([]); // המוצרים שנבחרו להצגה בחלון הקופץ
  const [isOpen, setIsOpen] = useState(false); // האם החלון הקופץ פתוח או סגור
  const [selectedCartIndex, setSelectedCartIndex] = useState<number | null>(null); // איזה סל נבחר להצגה (אינדקס בטבלה)

  // מחשבים את סכום המחירים בכל סל
  const totals = carts.map(cart => cart.products.reduce((sum, p) => sum + p.price, 0));
  const maxTotal = totals.length > 0 ? Math.max(...totals) : 0; // הסכום הגדול ביותר בין כל הסלים

  // פונקציה לפתיחת החלון הקופץ עם המוצרים של סל מסוים
  const openPopup = (products: ProductDTO[], index: number) => {
    setSelectedProducts(products);
    setSelectedCartIndex(index);
    setIsOpen(true);
  };

  // פונקציה לסגירת החלון הקופץ
  const closePopup = () => {
    setIsOpen(false);
    setSelectedCartIndex(null);
  };

  // פונקציה לעצירת הפצת אירוע הקלקה כדי שלא ייסגר החלון כשמקישים עליו (רק כשהקליק מחוץ לחלון)
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <MainLayout>
      <div className="w-full flex flex-col items-center mt-8">
        {/* כותרת עיקרית */}
        <h2 className="text-2xl font-bold mb-8 mt-8 text-[#08857D]">השוואת סלים</h2>

        {/* טבלה המציגה את הסלים */}
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <thead>
              <tr className="bg-[#f5fafd]">
                {/* כותרות העמודות */}
                <th className="py-3 px-4 font-semibold text-[#08857D] text-right">שם</th>
                <th className="py-3 px-4 font-semibold text-[#08857D] text-right">כתובת</th>
                <th className="py-3 px-4 font-semibold text-[#08857D] text-center">מוצרים</th>
                <th className="py-3 px-4 font-semibold text-[#08857D] text-center">סה"כ</th>
                <th className="py-3 px-4 font-semibold text-[#08857D] text-center">חיסכון</th>
              </tr>
            </thead>
            <tbody>
              {/* מיפוי הסלים לשורות */}
              {carts.map((cart, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-gray-50 transition ${
                    selectedCartIndex === idx ? 'bg-[#e6fafa] border-2 border-[#0db0a5]' : ''
                  }`}
                >
                  {/* עמודות השורה */}
                  <td className="py-2 px-4 border-t font-bold text-gray-700 text-right">{cart.storeName}</td>
                  <td className="py-2 px-4 border-t text-gray-700 text-right">{cart.address}</td>
                  <td className="py-2 px-4 border-t text-center">
                    {/* כפתור לפתיחת החלון הקופץ */}
                    <button
                      onClick={() => openPopup(cart.products, idx)}
                      className="text-[#08857D] hover:underline"
                    >
                      הצג מוצרים
                    </button>
                  </td>
                  <td className="py-2 px-4 border-t text-center text-green-500 font-semibold">
                    {/* סה"כ מחיר */}
                    {cart.products.reduce((sum, p) => sum + p.price, 0).toFixed(2)} ₪
                  </td>
                  <td className="py-2 px-4 border-t text-center text-gray-700">
                    {/* חיסכון לעומת הסל היקר ביותר */}
                    {(maxTotal - totals[idx]).toFixed(2)} ₪
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* חלון קופץ להצגת פרטי הסל */}
        {isOpen && selectedCartIndex !== null && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 cursor-pointer"
            onClick={closePopup} // סגירת החלון בלחיצה על הרקע השחור
          >
            <div
              className="bg-white p-6 rounded-xl shadow-lg border-4 border-[#08857D] w-96 max-h-[80vh] overflow-auto relative cursor-auto"
              onClick={stopPropagation} // מונע סגירה כשמקישים בתוך החלון עצמו
            >
              {/* כפתור X קטן לסגירה, מיקום מוחלט */}
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>

              {/* כותרת החלון */}
              <h3 className="text-xl font-bold mb-4 text-[#08857D] text-center">
                הסל ב־{carts[selectedCartIndex].storeName}
              </h3>

              {/* רשימת המוצרים עם המחירים */}
              <ul className="space-y-2">
                {selectedProducts.map((product, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-1 text-sm text-gray-700"
                  >
                    <span className="text-green-500 font-semibold">
                      {product.price.toFixed(2)} ₪
                    </span>
                    <span>{product.ProductName}</span>
                  </li>
                ))}
              </ul>
              {/* הסרנו כפתור חזור כי הסגירה נעשית על ידי לחיצה על הרקע או על ה-X */}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartComparison;
