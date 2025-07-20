// import React, { useEffect, useState } from "react";
// import { Item } from "@smartcart/shared/src/item";
// import { Tag } from "@smartcart/shared/src/tag";
// import ProductCard from "./ProductCard";
// import TagFilter from "./ProductTags";

// // הנתונים הקבועים שלך
// const products: Item[] = [
//   {
//     itemCode: 1001,
//     itemId: 101,
//     itemType: 1,
//     itemName: "תפוח עץ",
//     correctItemName: "תפוח עץ",
//     manufacturerName: "חקלאות ישראל",
//     manufactureCountry: "ישראל",
//     manufacturerItemDescription: "תפוח אדום טרי",
//     itemStatus: true,
//     tagsId: [1, 2],
//   },
//   {
//     itemCode: 1002,
//     itemId: 102,
//     itemType: 1,
//     itemName: "בננה",
//     correctItemName: "בננה",
//     manufacturerName: "חקלאות ישראל",
//     manufactureCountry: "ישראל",
//     manufacturerItemDescription: "בננות מתוקות",
//     itemStatus: true,
//     tagsId: [2],
//   },
//   {
//     itemCode: 1003,
//     itemId: 103,
//     itemType: 1,
//     itemName: "מלפפון",
//     correctItemName: "מלפפון",
//     manufacturerName: "חקלאות ישראל",
//     manufactureCountry: "ישראל",
//     manufacturerItemDescription: "מלפפונים טריים",
//     itemStatus: true,
//     tagsId: [3],
//   },
//   {
//     itemCode: 1004,
//     itemId: 104,
//     itemType: 1,
//     itemName: "חלב",
//     correctItemName: "חלב",
//     manufacturerName: "תנובה",
//     manufactureCountry: "ישראל",
//     manufacturerItemDescription: "חלב טרי 3%",
//     itemStatus: true,
//     tagsId: [4, 5],
//   },
//   {
//     itemCode: 1005,
//     itemId: 105,
//     itemType: 1,
//     itemName: "לחם",
//     correctItemName: "לחם",
//     manufacturerName: "אנג'ל",
//     manufactureCountry: "ישראל",
//     manufacturerItemDescription: "לחם שחור",
//     itemStatus: true,
//     tagsId: [],
//   },
// ];

// const tags: Tag[] = [
//   { tagId: 1, tagName: "פירות וירקות", isAlreadyScanned: false },
//   { tagId: 2, tagName: "פירות טריים", isAlreadyScanned: false },
//   { tagId: 3, tagName: "ירקות טריים", isAlreadyScanned: false },
//   { tagId: 4, tagName: "מוצרי חלב", isAlreadyScanned: false },
//   { tagId: 5, tagName: "חלב", isAlreadyScanned: false },
//   { tagId: 6, tagName: "גבינות", isAlreadyScanned: false },
// ];

// interface ProductSearchPageProps {
//   setSelectdItemsGlobal: (items: Item[]) => void;
//   setSelectedTagsTypeTags: (tag: Tag[]) => void;
//   onSelectionChange?: (selectedItems: Item[]) => void;
//   tagsFromServer: Tag[];
//   search: string;
// }

// const ProductSearchPage: React.FC<ProductSearchPageProps> = ({
//   onSelectionChange,
//   tagsFromServer,
//   search,
//   setSelectedTagsTypeTags,
//   setSelectdItemsGlobal,
// }) => {
//   const [selectedItems, setSelectedItems] = useState<Item[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Item[]>(products);

//   useEffect(() => {
//     setSelectdItemsGlobal(selectedItems);
//   }, [selectedItems, setSelectdItemsGlobal]);

//   const toggleSelect = (product: Item) => {
//     setSelectedItems((prev) => {
//       const isSelected = prev.some((p) => p.itemId === product.itemId);
//       const newSelected = isSelected
//         ? prev.filter((p) => p.itemId !== product.itemId)
//         : [...prev, product];

//       if (onSelectionChange) {
//         onSelectionChange(newSelected);
//       }

//       return newSelected;
//     });
//   };

//   const selectAll = () => {
//     setSelectedItems(filteredProducts);
//     if (onSelectionChange) {
//       onSelectionChange(filteredProducts);
//     }
//   };

//   const clearSelection = () => {
//     setSelectedItems([]);
//     if (onSelectionChange) {
//       onSelectionChange([]);
//     }
//   };

//   const handleTagFilter = (tagName: string) => {
//     let filtered: Item[] = [];

//     if (tagName === "הכל") {
//       filtered = products;
//     } else if (tagName === "ללא תיוג") {
//       filtered = products.filter(
//         (product) => !product.tagsId || product.tagsId.length === 0
//       );
//     } else {
//       const selectedTag = tags.find((tag) => tag.tagName === tagName);
//       if (selectedTag) {
//         filtered = products.filter(
//           (product) =>
//             product.tagsId && product.tagsId.includes(selectedTag.tagId)
//         );
//       }
//     }

//     setFilteredProducts(filtered);
//     setSelectedItems([]);
//     if (onSelectionChange) {
//       onSelectionChange([]);
//     }
//   };

//   return (
//     <div className="space-y-3 p-4">
//       <TagFilter
//         onTagSelect={handleTagFilter}
//         tags={tags}
//         //setSelectedTagsTypeTags={setSelectedTagsTypeTags}  
//       />

//       <div className="flex gap-4 mb-4">
//         <button
//           onClick={selectAll}
//           className="bg-gray-200 text-gray-800 text-sm px-3 py-1.5 rounded hover:bg-gray-300"
//         >
//           בחר הכל ({filteredProducts.length})
//         </button>
//         <button
//           onClick={clearSelection}
//           className="bg-gray-200 text-gray-800 text-sm px-3 py-1.5 rounded hover:bg-gray-300"
//         >
//           נקה בחירה
//         </button>
//         <div className="text-sm text-gray-600 flex items-center">
//           מציג {filteredProducts.length} מתוך {products.length} מוצרים
//         </div>
//       </div>

//       {/* רשימת המוצרים בתוך תיבה עם גלילה */}
//       <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400">
//         {filteredProducts.map((product) => (
//           <ProductCard
//             key={product.itemId}
//             product={product}
//             tags={tags}
//             isSelected={selectedItems.some((p) => p.itemId === product.itemId)}
//             toggleSelect={() => toggleSelect(product)}
//           />
//         ))}

//         {filteredProducts.length === 0 && (
//           <div className="text-center text-gray-500 py-8">
//             לא נמצאו מוצרים עבור התג הנבחר
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductSearchPage;

export {};
