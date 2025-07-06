import React, { useContext } from 'react';
import { cartContext } from '../store/redux/cartRedux';
import ProductDetails from './ProductDetails';
import '../index.css';
import '../App.css';
const Cart: React.FC = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("Cart must be used within a CartProvider");
  }
  const { cartItems } = context;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <header className="bg-[#23262B] py-10 mb-10 w-full">
        <h1 className="text-5xl font-extrabold text-center text-white tracking-tight">Cart</h1>
      </header>
      <main className="w-full max-w-6xl flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-left w-full">Items ({cartItems.length})</h2>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-xl">הסל ריק</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {cartItems.map((item) => (
              <ProductDetails
                key={item.itemId}
                item={{
                  itemCode: 1,
                  itemId: item.itemId,
                  itemType: 0,
                  itemName: "מוצר דמה",
                  correctItemName: "שם מתוקן",
                  manufacturerName: "יצרן דמה",
                  manufactureCountry: "ישראל",
                  manufacturerItemDescription: "תיאור דמה",
                  itemStatus: true,
                  tagsId: [],
                }}
                price={{
                  priceId: 1,
                  storeId: 1,
                  itemId: item.itemId,
                  itemCode: 1,
                  price: 10,
                  priceUpdateDate: new Date(),
                  unitQuantity: "1",
                  quantity: 100,
                  unitOfMeasure: "יחידה",
                  isWeighted: false,
                  quantityInPackage: "6",
                  unitOfMeasurePrice: 10,
                  allowDiscount: true,
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default Cart;





