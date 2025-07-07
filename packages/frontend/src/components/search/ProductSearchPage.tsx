// //מחולק לקבצים
// import React, { useEffect, useState } from "react";
// import { Item } from "@smartcart/shared/src/item";
// import { Tag } from "@smartcart/shared/src/tag";
// import { itemService } from "@smartcart/backend/src/injection.config";
// import { tagService } from "@smartcart/backend/src/injection.config";
// import ProductCard from "./ProductCard"; // הנתיב לקובץ שלך

// const ProductSearchPage: React.FC = () => {
//   const [products, setProducts] = useState<Item[]>([]);
//   const [tags, setTags] = useState<Tag[]>([]);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const [items, tagList] = await Promise.all([
//         itemService.getAllItem(),
//         tagService.getAllTags(),
//       ]);
//       setProducts(items);
//       setTags(tagList ?? []);
//     };
//     fetchData();
//   }, []);

//   const toggleSelect = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="space-y-3 p-4">
//       {products.map((product) => (
//         <ProductCard
//           key={product.itemId}
//           product={product}
//           tags={tags}
//           isSelected={selectedIds.includes(product.itemCode)}
//           toggleSelect={toggleSelect}
//         />
//       ))}
//     </div>
//   );
// };

// export default ProductSearchPage;







import React, { useState } from "react";
import { Item } from "@smartcart/shared/src/item";
import { Tag } from "@smartcart/shared/src/tag";
import ProductCard from "./ProductCard";

// הנתונים הקבועים שלך
const products: Item[] = [
  {
    itemCode: 1001,
    itemId: 101,
    itemType: 1,
    itemName: "תפוח עץ",
    correctItemName: "תפוח עץ",
    manufacturerName: "חקלאות ישראל",
    manufactureCountry: "ישראל",
    manufacturerItemDescription: "תפוח אדום טרי",
    itemStatus: true,
    tagsId: [1, 2],
  },
  {
    itemCode: 1002,
    itemId: 102,
    itemType: 1,
    itemName: "בננה",
    correctItemName: "בננה",
    manufacturerName: "חקלאות ישראל",
    manufactureCountry: "ישראל",
    manufacturerItemDescription: "בננות מתוקות",
    itemStatus: true,
    tagsId: [2],
  },
  {
    itemCode: 1003,
    itemId: 103,
    itemType: 1,
    itemName: "מלפפון",
    correctItemName: "מלפפון",
    manufacturerName: "חקלאות ישראל",
    manufactureCountry: "ישראל",
    manufacturerItemDescription: "מלפפונים טריים",
    itemStatus: true,
    tagsId: [2],
  },
];

const tags: Tag[] = [
  { tagId: 1, tagName: "פירות וירקות", isAlreadyScanned: false },
  { tagId: 2, tagName: "פירות טריים", isAlreadyScanned: false },
  { tagId: 3, tagName: "ירקות טריים", isAlreadyScanned: false },
  { tagId: 4, tagName: "מוצרי חלב", isAlreadyScanned: false },
  { tagId: 5, tagName: "חלב", isAlreadyScanned: false },
  { tagId: 6, tagName: "גבינות", isAlreadyScanned: false },
];

interface ProductSearchPageProps {
  onSelectionChange?: (selectedItems: Item[]) => void;
}

const ProductSearchPage: React.FC<ProductSearchPageProps> = ({ onSelectionChange }) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const toggleSelect = (product: Item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((p) => p.itemId === product.itemId);
      const newSelected = isSelected
        ? prev.filter((p) => p.itemId !== product.itemId)
        : [...prev, product];

      // כאן את מודיעה החוצה
      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }

      return newSelected;
    });
  };

  return (
    <div className="space-y-3 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.itemId}
          product={product}
          tags={tags}
          isSelected={selectedItems.some((p) => p.itemId === product.itemId)}
          toggleSelect={() => toggleSelect(product)}
        />
      ))}
    </div>
  );
};

export default ProductSearchPage;