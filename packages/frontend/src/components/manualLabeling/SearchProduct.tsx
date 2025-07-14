
import React, { useState } from "react";

interface SearchProductProps {
  setSearch: (query: string) => void;
}

const SearchProduct: React.FC<SearchProductProps> = ( {setSearch}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setSearch(query);
  };

  return (
    <div
      className="flex flex-col items-end p-9 bg-gray-100 rounded-lg shadow-md"
      style={{
        position: "absolute",
        right: "5%",
        top: "10%",
        transform: "scale(1.5)",
        zIndex: 10,
      }}
    >
      <form onSubmit={handleSubmit} className="flex w-full max-w-md justify-end">
        <button
          type="submit"
          className="bg-blue-300 text-white rounded-l-md px-6 py-2 font-bold hover:bg-blue-400 transition duration-300"
        >
          חפש
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-400 rounded-r-md p-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-300 text-right"
          placeholder="הכנס טקסט לחיפוש..."
          dir="rtl"
        />
      </form>
    </div>
  );
};
export default SearchProduct;