import React, { useState, useEffect, useCallback } from 'react';
import { ProductSearchResult } from './createAlertModal';
import { ProductDTO } from '@smartcart/shared';
import { StoreLocationDto } from '../../../../shared/src/dto/StoreLocation.dto';
import { calculateDiscountPercentage } from './math';

interface ProductSearchAndSelectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: ProductSearchResult[];
  setSearchResults: (results: ProductSearchResult[]) => void;
  selectedProduct: ProductDTO | null;
  setSelectedProduct: (product: ProductDTO | null) => void;
  minDiscount: number;
  maxDistance: number;
  allStores: StoreLocationDto[];
  userLatitude: number | null;
  userLongitude: number | null;
  isFormDisabled: boolean;
}

const ProductSearchAndSelection: React.FC<ProductSearchAndSelectionProps> = ({
  searchTerm,
  setSearchTerm,
  searchResults,
  setSelectedProduct,
  allStores,
  userLatitude,
  userLongitude,
  isFormDisabled,
  selectedProduct,
}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const createGeneralProductDTO = useCallback((result: ProductSearchResult): ProductDTO => {
    return new ProductDTO(
      result.item.itemCode,
      result.item.priceId as number,
      result.item.ProductName,
      result.item.storePK,
      result.item.itemName,
      result.item.itemStatus,
      result.item.manufacturerItemDescription,
      result.item.manufacturerName,
      result.price.price,
      result.item.unitOfMeasurePrice,
      result.item.quantityInPackage,
      result.item.hasPromotion,
      result.item.promotionText
    );
  }, []);

  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="product-search-box" style={{ fontFamily: 'Arial, sans-serif', padding: '10px' }}>
      <h3 style={{ marginBottom: '8px' }}>Product Selection</h3>
      <label htmlFor="productSearch" style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Search Product:</label>
      <input
        id="productSearch"
        type="text"
        placeholder="Search for a product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isFormDisabled}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginBottom: '10px',
          fontSize: '14px'
        }}
      />
      {debouncedSearchTerm && searchResults.length > 0 && (
        <div className="search-results" style={{ borderTop: '1px solid #eee' }}>
          {searchResults.map((result) => {
            const isSelected = selectedProduct?.itemCode === result.item.itemCode;

            return (
              <div
                key={result.item.itemCode + result.item.ProductName}
                className={`result-item ${isSelected ? 'selected' : ''}`}
                onClick={() => !isFormDisabled && setSelectedProduct(createGeneralProductDTO(result))}
                style={{
                  padding: '8px',
                  backgroundColor: isSelected ? '#f0f0f0' : 'white',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee'
                }}
              >
                <div><strong>{result.item.ProductName}</strong></div>
              </div>
            );
          })}
        </div>
      )}
      {selectedProduct && (
        <p className="selected-product" style={{ marginTop: '10px', fontWeight: 'bold' }}>Selected Product: {selectedProduct.ProductName}</p>
      )}
      {!selectedProduct && searchResults.length === 0 && searchTerm.length > 0 && (
        <p>No products found matching "{searchTerm}".</p>
      )}
    </div>
  );
};

export default ProductSearchAndSelection;
