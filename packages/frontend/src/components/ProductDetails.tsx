import React, { useEffect, useState } from 'react'
import { Item } from '@smartcart/shared/src/item';


interface ProductDetailsProps {
  item: Item;
}
const ProductDetails: React.FC<ProductDetailsProps> = ({ item }) => {
const fields:{label:string;value:React.ReactNode}[]=[
  {label:'קוד מוצר',value:item.ItemCode},
  {label:'יצרן',value:`${item.ManufacturerName} (${item.ManufactureCountry})`},
  { label: 'תיאור מוצר', value: item.ManufacturerItemDescription },
  { label: 'כמות יחידות באריזה', value: `${item.QtyInPackage} ${item.UnitOfMeasure}` },
  { label: 'כמות', value: `${item.Quantity} ${item.UnitOfMeasure}` },
  { label: 'מחיר ליחידה', value: `${item.UnitOfMeasurePrice.toFixed(2)} ₪` },
  { label: 'מחיר כולל', value: `${item.ItemPrice.toFixed(2)} ₪` },
  { label: 'עודכן לאחרונה ב', value: new Date(item.PriceUpdateDate).toLocaleDateString() }
]

  return (
      <div className=" border rounded-lg p-4 max-w-md 
        shadow bg-white 
        hover:bg-gray-100 
        hover:shadow-lg 
        transform transition 
        duration-200 
        hover:-translate-y-1
      " >
        <h2 className="text-xl font-bold mb-2">{item.ItemName}</h2>
        {fields.map(({label,value},index)=>(
          <p key={index} className="text-gray-600 text-sm mb-1" >
            <strong>{label}:</strong> {value}
          </p>
          ))}
           {Number(item.AllowDiscount) === 1 && (
        <p className="text-green-700 font-bold text-xl mt-2 bg-green-100 rounded px-2 py-1 inline-block">
          זמין להנחה
        </p>
      )}
      </div>
  )
}

export default ProductDetails