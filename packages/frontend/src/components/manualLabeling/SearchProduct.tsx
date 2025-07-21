import React, { useState } from "react";

interface SearchProductProps {
  setSearch: (query: string) => void;
}

const SearchProduct: React.FC<SearchProductProps> = ({ setSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(query);
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-6 w-full">
      <form onSubmit={handleSubmit} className="flex flex-row-reverse w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-400 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-right"
          placeholder="הכנס טקסט לחיפוש..."
          dir="rtl"
          
        />
        <button
          type="submit"
          className="bg-blue-300 text-white rounded-r-md px-6 py-2 font-bold hover:bg-blue-400 transition duration-300 ml-2"
        >
          חפש
        </button>
      </form>
    </div>
  );
};


export default SearchProduct;
