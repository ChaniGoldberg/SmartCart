// import React, { useEffect, useState } from 'react'
// import { Item } from '@smartcart/shared/src/item';
// import { Price } from '@smartcart/shared/src/price'
// import { Tag } from '@smartcart/shared/src/tag';
// import {ProductDTO} from '../DTO/Product.dto'


// interface ProductDetailsProps {
//   product: ProductDTO;
//   // allTags: Tag[]; // רשימת כל התגים במערכת

// }
// const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
//   const fields: { label: string; value: React.ReactNode }[] = [
//     { label: 'שם מוצר', value: product.itemName },
//     { label: 'יצרן', value: `${product.manufacturerName} (${product.manufacturerName})` },
//     { label: 'תיאור', value: product.manufacturerItemDescription },
//     { label: 'כמות באריזה', value: product.quantityInPackage },
//     { label: 'מחיר', value: `₪${product.price.toFixed(2)} ` },
//     { label: 'מחיר ליחידה', value: `₪${product.unitOfMeasurePrice.toFixed(2)}  ` },
//   ]
//   const statusStyle = {
//     color: product.itemStatus ? 'green' : 'red',
//     fontWeight: 'bold',
//   }
 
//   return (
//     <div className=" border rounded-lg p-4 max-w-md 
//         shadow bg-white 
//         hover:bg-gray-100 
//         hover:shadow-lg 
//         transform transition 
//         duration-200 
//         hover:-translate-y-1
//       " >
//       <h2 className="text-xl font-bold mb-2">{product.itemName}</h2>
//       {fields.map(({ label, value }, index) => (
//         <p key={index} className="text-gray-600 text-sm mb-1" >
//           <strong>{label}:</strong> {value}
//         </p>
//       ))}
//       <p className="mb-1 text-sm text-gray-600">
//         <strong>סטטוס מוצר:</strong>{' '}
//         <span style={{ color: product.itemStatus ? 'green' : 'red', fontWeight: 'bold' }}>
//           {product.itemStatus ? 'במלאי' : 'לא במלאי'}
//         </span>
//       </p>

//     </div>
//   )
// }

// export default ProductDetails





import React from 'react'
import { Item } from '@smartcart/shared/src/item'
import { Price } from '@smartcart/shared/src/price'
import { Tag } from '@smartcart/shared/src/tag'
import { ProductDTO } from '../DTO/Product.dto'
interface ProductDetailsProps {
  product:ProductDTO
}
const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const fields: { label: string; value: React.ReactNode }[] = [
    { label: 'תיאור', value: product.manufacturerItemDescription || 'אין מידע זמין' },
    { label: 'מחיר', value: isFinite(product.price) ? `₪${product.price.toFixed(2)}` : 'לא עודכן' },
    { label: 'כמות באריזה', value: product.quantityInPackage || 'לא צוין' },
    { label: 'מחיר ליחידה', value: isFinite(product.unitOfMeasurePrice) ? `₪${product.unitOfMeasurePrice.toFixed(2)}` : 'לא זמין' },
    // { label: 'יצרן', value: product.manufacturerName && product.manufactureCountry ? `${product.manufacturerName} (${product.manufactureCountry})` : 'לא זמין' },
    {
      label: 'סטטוס מוצר', value: (
        <span
          className="font-bold"
          style={{
            color: product.itemStatus === true ? 'green' : product.itemStatus === false ? 'red' : 'gray',
          }}
        >
          {product.itemStatus === true ? 'במלאי' : product.itemStatus === false ? 'אזל מהמלאי' : 'לא זמין'}
        </span>
      )
    },
    // { label: 'שם המוצר', value: item.itemName || 'לא זמין' },
  ]
 
  
  return (
    <div className="w-full max-w-10xl mx-auto mt-3 bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition group">
      <h2 className="text-2xl font-bold text-right text-gray-800 mb-6">{product.itemName}</h2>
      <div className="flex flex-row flex-wrap gap-4 text-sm text-gray-800 text-right relative" dir='rtl'>
        {fields.map(({ value }, index) => (
          <div key={index} className="flex items-center whitespace-nowrap">
            <span className="text-gray-800">{value}</span>
            {index < fields.length - 1 && <span className="mx-2 text-gray-400">|</span>}
          </div>
        ))}
        {/* {productTags.length > 0 && (
          <div className="absolute left-0 top-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {productTags.map((tag) => (
              <span
                key={tag.tagId}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full shadow-sm mb-1"
                title={
                  tag.dateAdded
                    ? `נוסף ב־${new Date(tag.dateAdded).toLocaleDateString()}`
                    : ''
                }
              >
                {tag.tagName}
              </span>
            ))}
          </div>
        )} */}
      </div>
    </div>
  )
}
export default ProductDetails