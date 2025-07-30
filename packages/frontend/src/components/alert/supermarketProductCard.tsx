import React from "react";
import { StoreLocationDto, ProductDTO } from "@smartcart/shared";
import { Price } from "../../../../shared/src/price";
import { Promotion } from "../../../../shared/src/promotion";

export interface SupermarketProductData {
  store: StoreLocationDto;
  item: ProductDTO;
  price: Price;
  promotions: Promotion[];
  distance?: number;
  calculatedDiscountPercentage?: number;
}

export interface SupermarketProductCardProps {
  data: SupermarketProductData;
}

const SupermarketProductCard: React.FC<SupermarketProductCardProps> = ({ data }) => {
  return (
    <div className="product-card">
      <h3>{data.item.ProductName}</h3>
      <p>
        <strong>Store:</strong> {data.store.storeName} ({data.store.chainName})
        {data.distance !== undefined && <span> ({data.distance.toFixed(1)} km)</span>}
      </p>
      <p className="price">Price: {data.price.price.toFixed(2)} ₪</p>
      {data.calculatedDiscountPercentage && data.calculatedDiscountPercentage > 0 && (
        <p className="discount">Discount: {data.calculatedDiscountPercentage.toFixed(0)}%</p>
      )}
      {data.item.promotionText && (
        <p className="promotion">Promotion: {data.item.promotionText}</p>
      )}
    </div>
  );
};

export default SupermarketProductCard;
