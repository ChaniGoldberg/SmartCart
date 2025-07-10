import React from "react";
import ProductSearchPage from "./ProductSearchPage";
import SearchProduct from "./SearchProduct";

const TagSearchPage: React.FC = () => {
  return (
  <div>
    <ProductSearchPage></ProductSearchPage>
    {/* <SearchProduct onSearch={function (query: string): void {
        alert("ffff");
      } }></SearchProduct> */}
  </div>
  );
};

export default TagSearchPage;
