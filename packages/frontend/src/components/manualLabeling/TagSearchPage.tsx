// TagSearchPage.tsx
import React, { useEffect, useState } from "react";
import ProductSearchPage from "./ProductSearchPage";
import SearchProduct from "./SearchProduct";
import { Tag } from "@smartcart/shared";
import SelectedItems from "./SelectedItems";
import { Item } from "@smartcart/shared";
import ProductTagger from "./ProductTagger";

const TagSearchPage: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [selectedTagsTypeTags, setSelectedTagsTypeTags] = useState<Tag[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const loadTags = async (searchText: string = "חלב") => {
    setIsLoadingTags(true);
    setError(null);
    try {
      const url = `http://localhost:3001/api/search/textTag/${encodeURIComponent(
        searchText
      )}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`שגיאה בשרת: ${response.status}`);
      }
      const data: any = await response.json();
      setTags(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בחיבור לשרת");
      console.error("Error loading tags:", err);
    } finally {
      setIsLoadingTags(false);
    }
  };
const loadItems = async () => {
  setIsLoadingItems(true);
  setError(null);
  try {
    const response = await fetch('http://localhost:3001/api/items');
    if (!response.ok) {
      throw new Error(`שגיאה בשרת: ${response.status}`);
    }
    const data = await response.json();
    if (data.success && data.data) {
      setItems(data.data);
    } else {
      throw new Error(data.error || 'כשלון בקבלת מוצרים');
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'שגיאה כללית');
  } finally {
    setIsLoadingItems(false);
  }
};
  useEffect(() => {
    loadTags();
    loadItems();
  }, []);

  return (
    <div className="flex h-screen font-sans bg-white min-h-screen">
      {/* צד שמאל - נבחרים ותיוג */}
      <div className="w-2/5 flex flex-col justify-between border-l border-gray-300 bg-gray-50 p-6 min-h-screen">
      <div className=" p-4 w-full flex flex-col">
        <SelectedItems
          initialItems={selectedItems}
          setSelectedItems={setSelectedItems}
        /></div>
        <div className=" p-4 w-full flex flex-col top-2/5">
        <ProductTagger tags={tags} items={selectedItems} /></div>
      </div>

      {/* צד ימין - חיפוש ותוצאות */}
      <div className="w-3/5 p-8 space-y-6 min-h-screen">
        <SearchProduct setSearch={setSearch} />
        <ProductSearchPage
          products={items}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          tagsFromServer={tags}
          search={search}
          setSelectedTagsTypeTags={setSelectedTagsTypeTags}
        />
      </div>
    </div>
  );
};
export default TagSearchPage;
