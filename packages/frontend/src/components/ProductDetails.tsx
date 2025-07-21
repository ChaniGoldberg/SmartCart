import React, { useState } from 'react';
import { ProductDTO } from "@smartcart/shared/src/dto/Product.dto";
import { ProductCartDTO } from '@smartcart/shared';
interface ProductDetailsProps {
  productCart: ProductCartDTO;
  onQuantityChange?: (newQty: number) => void;
  onSuggestClick?: () => void;
}
const ProductDetails: React.FC<ProductDetailsProps> = ({ productCart, onQuantityChange, onSuggestClick }) => {
  const [currentQty, setCurrentQty] = useState<number>(productCart.quantity);
  const fields: { label: string; value: React.ReactNode }[] = [
    { label: 'תיאור', value: productCart.product.manufacturerItemDescription || 'אין מידע זמין' },
    { label: 'מחיר', value: isFinite(productCart.product.price) ? `₪${productCart.product.price.toFixed(2)}` : 'לא עודכן' },
    { label: 'כמות באריזה', value: productCart.product.quantityInPackage || 'לא צוין' },
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
          {productCart.product.itemStatus === true ? 'במלאי' : productCart.product.itemStatus === false ? 'אזל מהמלאי' : 'לא זמין'}
        </span>
      )
    }
  ];
  const changeQuantity = (delta: number) => {
    const newQty = Math.max(1, currentQty + delta);
    setCurrentQty(newQty);
    if (onQuantityChange) onQuantityChange(newQty);
  };
  return (
    <div className="w-full max-w-10xl mx-auto mt-3 bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition group">
      <h2 className="text-2xl font-bold text-right text-gray-800 mb-6">{productCart.product.itemName}</h2>
      <div className="flex flex-row flex-wrap gap-4 text-sm text-gray-800 text-right relative" dir='rtl'>
        {fields.map(({ value }, index) => (
          <div key={index} className="flex items-center whitespace-nowrap">
            <span className="text-gray-800">{value}</span>
            {index < fields.length - 1 && <span className="mx-2 text-gray-400">|</span>}
          </div>
        ))}
        {productCart.product.hasPromotion === 1 && productCart.product.promotionText && (
          <div className="text-green-700 font-bold mt-2">
            :tada: מבצע: {productCart.product.promotionText}
          </div>
        )}
      </div>
      <div className="flex items-center mt-4 gap-2">
        <button onClick={() => changeQuantity(-1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
        <span>{currentQty}</span>
        <button onClick={() => changeQuantity(1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
        {onSuggestClick && (
          <button onClick={onSuggestClick} className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded">
            הצג מוצר חלופי
          </button>
        )}
      </div>
    </div>
  );
};
export default ProductDetails;
