import { ProductDTO } from '@smartcart/shared/src/dto';
import React, { useContext } from 'react';
import { cartContext } from '../store/redux/cartRedux'; // ודא שאתה מייבא את ה-hook שלך

interface AlternativeItemsListProps {
  originalItem: ProductDTO;
  alternatives: ProductDTO[];
}

const ItemCard: React.FC<{ item: ProductDTO; actionButton?: React.ReactNode }> = ({
  item,
  actionButton,
}) => (
  <div
    className="transition-all duration-200 cursor-pointer hover:shadow-lg"
    style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px 0',
      backgroundColor: '#f9f9f9',
    }}
  >
    <h3 className="text-lg font-semibold text-gray-800">{item.ProductName}</h3>
    <p className="text-gray-600">מחיר: ₪{item.price}</p>
    {actionButton && <div className="mt-4">{actionButton}</div>}
  </div>
);

const AlternativeItemsList: React.FC<AlternativeItemsListProps> = ({
  originalItem,
  alternatives,
}) => {
  // const { setCartItems } = useCart(); // השתמש בקונטקסט
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("Cart must be used within a CartProvider");
  }
  const { removeFromCart, addToCart, cartItems } = context;
  const handleSelectAlternative = (item: ProductDTO) => {
    // const updatedCartItems = alternatives.filter(alt => alt.itemCode !== originalItem.itemCode).concat(item);
    // setCartItems(updatedCartItems); // שלח את הסל המעודכן לקונטקסט
    const originalItemCart = cartItems.find(item => originalItem.itemCode === item.product.itemCode) || { product: originalItem, quantity: 1 }
    removeFromCart(originalItemCart, originalItemCart.quantity)
    console.log("cartItems-afterRemove", cartItems);
    addToCart({ product: item, quantity: 1 }, 9)
    console.log("cartItems-afterAdd", cartItems);

  };

  return (
    <div className="w-full max-w-3xl px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">המוצר שלך</h2>
      <ItemCard item={originalItem} />

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-700">חלופות זולות יותר</h3>
      {alternatives.map((alt) => (
        <ItemCard
          key={alt.itemCode}
          item={alt}
          actionButton={
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => handleSelectAlternative(alt)} // הפעל את הפונקציה
            >
              החלף בחלופה זו
            </button>
          }
        />
      ))}
    </div>
  );
};

export default AlternativeItemsList;
