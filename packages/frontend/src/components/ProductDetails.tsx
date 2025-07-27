import React, { useContext, useState } from 'react';
import { ProductDTO } from "@smartcart/shared";
import { ProductCartDTO } from '@smartcart/shared/src/dto/ProductCart.dto';
import { cartContext } from '../store/redux/cartRedux';
import ItemCard from './ItemCard';
import AlternativeItemsList from './AlternativeItemsList';
import { itemfuzzySearch } from '../../../backend/src/controllers/fuzzySearchController'
import { searchApiService } from '../services/searchApi';
interface ProductDetailsProps {
  productCart: ProductCartDTO;
  onQuantityChange?: (newQty: number) => void;
  onSuggestClick?: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productCart, onQuantityChange, onSuggestClick }) => {
  const [currentQty, setCurrentQty] = useState<number>(productCart.quantity);
  const [showConfirm, setShowConfirm] = useState(false);
  const [suggestClick, setSuggestClick] = useState(false);
  const [alternativesItem, setAlternativesItems] = useState<ProductDTO[]>([])

  const { addToCart, removeFromCart } = useContext(cartContext);
  const popUpAlternatives = async () => {
    const updatedProductsList = [productCart.product]//.map(item => {
  //    return { ...item, ProductName: "vvv", itemCode: "6" }; // עדכן את שם המוצר
  //  });
    setAlternativesItems(updatedProductsList);
    setSuggestClick(true);

  }

  const changeQuantity = (delta: number) => {
    const newQty = Math.max(1, currentQty + delta);
    setCurrentQty(newQty);
    console.log("currentQty", currentQty);


    if (delta > 0) {
      addToCart(productCart, 1);
    } else if (delta < 0) {
      removeFromCart(productCart, 1);
    }

    if (onQuantityChange) onQuantityChange(newQty);
  };

  const handleRemoveItem = () => {
    setShowConfirm(true);
  };

  const confirmRemove = () => {
    removeFromCart(productCart, currentQty);
    setCurrentQty(0);
    if (onQuantityChange) onQuantityChange(0);
    setShowConfirm(false);
  };

  const cancelRemove = () => {
    setShowConfirm(false);
  };


  const fields: { label: string; value: React.ReactNode }[] = [
    { label: 'תיאור', value: productCart.product.manufacturerItemDescription || 'אין מידע זמין' },
    { label: 'מחיר', value: isFinite(productCart.product.price) ? `₪${productCart.product.price.toFixed(2)}` : 'לא עודכן' },
    { label: 'כמות באריזה', value: currentQty }, // שינוי כאן!

    { label: 'מחיר ליחידה', value: isFinite(productCart.product.unitOfMeasurePrice) ? `₪${productCart.product.unitOfMeasurePrice.toFixed(2)}` : 'לא זמין' },
    {
      label: 'סטטוס מוצר',
      value: (
        <span
          className="font-bold"
          style={{
            color: productCart.product.itemStatus === true ? 'green' : productCart.product.itemStatus === false ? 'red' : 'gray',
          }}
        >
          {productCart.product.itemStatus === true ? 'קיים במלאי' : productCart.product.itemStatus === false ? 'אזל מהמלאי' : 'לא זמין'}
        </span>
      )
    }
  ];


  return (
    <div className="w-full max-w-10xl mx-auto mt-3 bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition group">
      <h2 className="text-2xl font-bold text-right text-gray-800 mb-6">{productCart.product.ProductName}</h2>
      <div className="flex flex-row flex-wrap gap-4 text-sm text-gray-800 text-right relative" dir='rtl'>
        {fields.map(({ value }, index) => (
          <div key={index} className="flex items-center whitespace-nowrap">
            <span className="text-gray-800">{value}</span>
            {index < fields.length - 1 && <span className="mx-2 text-gray-400">|</span>}
          </div>
        ))}
        {productCart.product.hasPromotion === 1 && productCart.product.promotionText && (
          <div className="w-full text-green-700 font-bold mt-2 text-right">
            מבצע: {productCart.product.promotionText}
          </div>
        )}
      </div>

      <div className="flex items-center mt-4 gap-2">
        <button
          onClick={() => changeQuantity(-1)}
          className="px-2 py-1 bg-gray-200 rounded"
          disabled={currentQty <= 1}
          style={currentQty <= 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          -
        </button>
        <span>{currentQty}</span>
        <button onClick={() => changeQuantity(1)} className="px-2 py-1 bg-gray-200 rounded">+</button>

        <button onClick={handleRemoveItem} className="ml-1 px-1 py-1 bg-red-50 text-red-600 rounded">
          מחק פריט
        </button>
        <button onClick={() => popUpAlternatives()} className="ml-1 px-1 py-1 bg-blue-50 text-blue-600 rounded">
          מוצר חלופי
        </button>
      </div>
      {/* מודל אישור מחיקה */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <div className="text-lg mb-4 font-bold text-gray-800">האם את/ה בטוח/ה שברצונך למחוק את הפריט?</div>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                מחק
              </button>
              <button
                onClick={cancelRemove}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                בטל
              </button>
            </div>
          </div>
        </div>

      )}
     
    
      {suggestClick && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div
            className="bg-white shadow-lg p-8 w-full max-w-md relative animate-fade-in text-right"
            style={{ maxHeight: '80vh', overflowY: 'auto' }} // הוספת גלילה וגובה מקסימלי
          >
            <button
              className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setSuggestClick(false)}
            >
              ×
            </button>
            <AlternativeItemsList
              originalItem={productCart.product}
              alternatives={alternativesItem}
            />
          </div>
        </div>
      )}
    </div>

  );
};

export default ProductDetails;