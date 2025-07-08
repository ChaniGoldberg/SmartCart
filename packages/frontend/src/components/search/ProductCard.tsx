import React from "react";
import { Item } from "@smartcart/shared/src/item";
import { Tag } from "@smartcart/shared/src/tag";

interface ProductCardProps {
  product: Item;
  tags: Tag[];
  isSelected: boolean;
  toggleSelect: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  tags,
  isSelected,
  toggleSelect,
}) => {
  return (
  <div
    key={product.itemId}
    dir="rtl"
    className={`relative rounded border p-4 ${
      isSelected ? "border-blue-300 bg-blue-50" : "border-gray-300 bg-white"
    }`}
  >
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => toggleSelect(product.itemCode)}
      className="absolute top-10 right-3 w-5 h-5"
    />

    <div className="flex flex-col text-right pr-8">
      <h1 className="font-bold text-lg">{product.itemName}</h1>
      {product.manufacturerName && (
        <div className="text-gray-700 text-sm mt-0.5">
          {product.manufacturerName}
        </div>
      )}

      {(() => {
        if (product.tagsId && product.tagsId.length > 0) {
          return (
            <div className="flex flex-wrap gap-2 mt-2">
              {product.tagsId
                .map((tagId) => tags.find((t) => t.tagId === tagId))
                .filter((t): t is Tag => t !== undefined)
                .map((t) => (
                  <span key={t.tagId} className="text-green-600 text-xs">
                    {t.tagName}
                  </span>
                ))}
            </div>
          );
        }
        return null;
      })()}
    </div>
  </div>
);

};

export default ProductCard;


