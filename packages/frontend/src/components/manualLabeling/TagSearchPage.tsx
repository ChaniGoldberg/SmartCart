// // TagSearchPage.tsx
// import React, { useEffect, useState } from "react";
// import ProductSearchPage from "./ProductSearchPage";
// import SearchProduct from "./SearchProduct";
// import { Tag } from "@smartcart/shared/src/tag";
// import SelectedItems from "./SelectedItems";
// import { Item } from "@smartcart/shared/src/item";
// import ProductTagger from "./ProductTagger";

// const TagSearchPage: React.FC = () => {
//   const [search, setSearch] = useState<string>('');
//   const [tags, setTags] = useState<Tag[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedItems, setSelectedItems] = useState<Item[]>([]);
//   const [selectedTagsTypeTags, setSelectedTagsTypeTags] = useState<Tag[]>([]);

//   const loadTags = async (searchText: string = 'חלב') => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const url = `http://localhost:3001/api/search/textTag/${encodeURIComponent(searchText)}`;
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`שגיאה בשרת: ${response.status}`);
//       }
//       const data: any = await response.json();
//       setTags(data.items);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'שגיאה בחיבור לשרת');
//       console.error('Error loading tags:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTags();
//   }, []);

//   return (
//     <div className="flex h-screen font-sans bg-white">
//       {/* צד שמאל - נבחרים ותיוג */}
//       <div className="w-2/5 flex flex-col justify-between border-l border-gray-300 bg-gray-50 p-6 space-y-6">
//         <div>
//           {/* קומפוננטה 4 - מוצרים נבחרים */}
//           <SelectedItems initialItems={selectedItems} />
//         </div>
//         <div>
//           {/* קומפוננטה 5 - הוספת תיוג למוצרים נבחרים */}
//           <ProductTagger tags={selectedTagsTypeTags} items={selectedItems} />
//         </div>
//       </div>

//       {/* צד ימין - חיפוש ותוצאות */}
//       <div className="w-3/5 p-8 space-y-6 overflow-y-auto">
//         <div className="space-y-4">
//           {/* קומפוננטה 1 - שורת חיפוש */}
//           <div className="w-full">
//             <SearchProduct setSearch={setSearch} />
//           </div>

//           {/* קומפוננטה 2 - תוצאות חיפוש עם קומפוננטה 3 בפנים */}
//           <ProductSearchPage
//             setSelectdItemsGlobal={setSelectedItems}
//             tagsFromServer={tags}
//             search={search}
//             setSelectedTagsTypeTags={setSelectedTagsTypeTags}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TagSearchPage;
export {};
