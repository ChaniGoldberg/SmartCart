

import React, { useEffect, useState } from "react";
import ProductSearchPage from "./ProductSearchPage";
import SearchProduct from "./SearchProduct";
import { Tag } from "@smartcart/shared/src/tag";


const TagSearchPage: React.FC = () => {
  //החזקת מילת החיפוש
  const [search, setSearch] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // קריאות שרת
  
    const loadTags = async (searchText: string = 'חלב') => {
        setIsLoading(true);
        setError(null);

        try {

            const url = `http://localhost:3001/api/search/textTag/${encodeURIComponent(searchText)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`שגיאה בשרת: ${response.status}`);
            }

            const data: any = await response.json();
            setTags(data.items)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'שגיאה בחיבור לשרת');
            console.error('Error loading tags:', err)
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => { 
        loadTags();
    }, []);
  return (
    <div>
      {/* החלק הימני של המסך */}
      <div>
      <SearchProduct setSearch={setSearch}></SearchProduct>
      <ProductSearchPage tagsFromServer={tags} search={search}></ProductSearchPage>
    </div>
    {/* החלק השמאלי של המסך */}
   <div>
    
   </div>
    </div>

  );
};

export default TagSearchPage;
