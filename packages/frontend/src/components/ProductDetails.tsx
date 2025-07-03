import React, { useEffect, useState } from 'react'
import { Item } from '@smartcart/shared/src/item';
import { Price } from '@smartcart/shared/src/price'
import { Tag } from '@smartcart/shared/src/tag';


interface ProductDetailsProps {
  item: Item;
  price: Price;
  // allTags: Tag[]; // רשימת כל התגים במערכת

}
const ProductDetails: React.FC<ProductDetailsProps> = ({ item, price }) => {
  const allTags:Tag[]=[]
  const fields: { label: string; value: React.ReactNode }[] = [
    { label: 'שם מוצר', value: item.itemName },
    { label: 'יצרן', value: `${item.manufacturerName} (${item.manufactureCountry})` },
    { label: 'תיאור', value: item.manufacturerItemDescription },
    { label: 'כמות באריזה', value: price.quantityInPackage },
    { label: 'מחיר', value: `₪${price.price.toFixed(2)} ` },
    { label: 'מחיר ליחידה', value: `₪${price.unitOfMeasurePrice.toFixed(2)}  ` },
  ]
  const statusStyle = {
    color: item.itemStatus ? 'green' : 'red',
    fontWeight: 'bold',
  }
  const productTags = item.tagsId ? allTags.filter(tag => item.tagsId!.includes(tag.tagId))
    : [];

  return (
    <div className=" border rounded-lg p-4 max-w-md 
        shadow bg-white 
        hover:bg-gray-100 
        hover:shadow-lg 
        transform transition 
        duration-200 
        hover:-translate-y-1
      " >
      <h2 className="text-xl font-bold mb-2">{item.itemName}</h2>
      {fields.map(({ label, value }, index) => (
        <p key={index} className="text-gray-600 text-sm mb-1" >
          <strong>{label}:</strong> {value}
        </p>
      ))}
      <p className="mb-1 text-sm text-gray-600">
        <strong>סטטוס מוצר:</strong>{' '}
        <span style={{ color: item.itemStatus ? 'green' : 'red', fontWeight: 'bold' }}>
          {item.itemStatus ? 'במלאי' : 'לא במלאי'}
        </span>
      </p>


      {productTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {productTags.map(tag => (
            <span
              key={tag.tagId}
              className="bg-gray-200 text-sm text-gray-800 px-2 py-1 rounded-full shadow-sm"
              title={tag.dateAdded ? `נוסף ב־${new Date(tag.dateAdded).toLocaleDateString()}` : ''}
            >
              {tag.tagName}
            </span>
          ))}
        </div>
      )}

    </div>
  )
}

export default ProductDetails