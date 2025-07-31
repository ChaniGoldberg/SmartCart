import React, { useState, useEffect, useMemo, useCallback } from "react";
import { StoreLocationDto } from "@smartcart/shared";
import { ProductDTO } from "@smartcart/shared";

export interface StoreChainSelectorProps {
  selectedProduct: ProductDTO | null;
  allStores: StoreLocationDto[];
  userLatitude: number | null;
  userLongitude: number | null;
  maxDistance: number;
  minDiscount: number;
  useAllNearbyStores: boolean;
  setUseAllNearbyStores: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStores: number[];
  setSelectedStores: React.Dispatch<React.SetStateAction<number[]>>;
  isLoading: boolean;
  locationLoading: boolean;
  locationError: string | null;
  isFormDisabled: boolean;
}

// פונקציה לחישוב מרחק בקילומטרים בין שתי נקודות גאוגרפיות
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // רדיוס כדור הארץ בק"מ
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const StoreChainSelector: React.FC<StoreChainSelectorProps> = ({
  selectedProduct,
  allStores,
  userLatitude,
  userLongitude,
  maxDistance,
  minDiscount,
  useAllNearbyStores,
  setUseAllNearbyStores,
  selectedStores,
  setSelectedStores,
  isLoading,
  locationLoading,
  locationError,
  isFormDisabled,
}) => {
  // סינון חנויות זמינות לפי מרחק מהמיקום הנוכחי והאם המוצר זמין
  const availableStores = useMemo(() => {
    if (!selectedProduct || userLatitude === null || userLongitude === null) return [];

    return allStores.filter((store) => {
      // חישוב מרחק
      const distance = calculateDistance(userLatitude, userLongitude, store.latitude, store.longitude);
      // תנאי למרחק + אפשר להוסיף כאן סינון לפי הנחה (minDiscount) אם רוצים
      return distance <= maxDistance;
    });
  }, [selectedProduct, allStores, userLatitude, userLongitude, maxDistance]);

  // איסוף שמות רשתות ייחודיות מתוך החנויות הזמינות
  const availableChains = useMemo(() => {
    const chains = new Set<string>();
    availableStores.forEach(store => chains.add(store.chainName));
    return Array.from(chains);
  }, [availableStores]);

  // טיפול בשינוי ב-checkbox של רשת חנויות
  const handleChainCheckboxChange = useCallback((chainName: string, isChecked: boolean) => {
   if (isChecked) {
  const chainStorePKs = availableStores
    .filter(s => s.chainName === chainName)
    .map(s => Number(s.storePK));  // להמיר למספר במפורש
  setSelectedStores(prev => Array.from(new Set([...prev, ...chainStorePKs])));
} else {
      // מסיר את כל החנויות של הרשת מרשימת הבחירה
      setSelectedStores(prev =>
  prev.filter(pk => !availableStores.some(s => s.chainName === chainName && Number(s.storePK) === pk))
);

    }
  }, [availableStores, setSelectedStores]);

  // טיפול בשינוי ב-checkbox של חנות ספציפית
  const handleStoreCheckboxChange = useCallback((storePK: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedStores(prev => {
        if (!prev.includes(storePK)) {
          return [...prev, storePK];
        }
        return prev;
      });
    } else {
      setSelectedStores(prev => prev.filter(pk => pk !== storePK));
    }
  }, [setSelectedStores]);

  // האם כל החנויות של הרשת נבחרו
  const isChainFullySelected = (chainName: string) => {
    const chainStorePKs = availableStores
  .filter(s => s.chainName === chainName)
  .map(s => Number(s.storePK));  // המרה ל-number

return chainStorePKs.every(pk => selectedStores.includes(pk));
}

  // האם החנות ספציפית נבחרה
  const isStoreSelected = (storePK: number) => selectedStores.includes(storePK);

  // האם כל הטופס מושבת (למשל בזמן טעינה)
  const isDisabled = isLoading || locationLoading || isFormDisabled;

  return (
    <div className="store-chain-selector">
      <h3>Select Stores</h3>
      <label>
        <input
          type="checkbox"
          checked={useAllNearbyStores}
          onChange={e => {
            setUseAllNearbyStores(e.target.checked);
            if (e.target.checked) setSelectedStores([]);
          }}
          disabled={isDisabled}
        />
        Select all nearby stores within {maxDistance} km (where product is available)
      </label>

      {!useAllNearbyStores && (
        <div className="manual-store-selection">
          <p><strong>Or select specific stores:</strong></p>

          {locationError && <p className="error">Location Error: {locationError}</p>}
          {(userLatitude === null || userLongitude === null) && !locationError && (
            <p>Please enable location to select stores manually.</p>
          )}
          {selectedProduct === null && (
            <p>Please select a product first to see stores.</p>
          )}

          {availableChains.length === 0 && selectedProduct !== null && (
            <p>No available chains found within the selected distance.</p>
          )}

          {availableChains.map(chainName => (
            <div key={chainName} className="chain-group">
              <label>
                <input
                  type="checkbox"
                  checked={isChainFullySelected(chainName)}
                  onChange={e => handleChainCheckboxChange(chainName, e.target.checked)}
                  disabled={isDisabled}
                />
                <strong>{chainName}</strong>
              </label>
              <div className="store-list">
                {availableStores
  .filter(store => store.chainName === chainName)
  .map(store => (
    <label key={store.storePK}>
      <input
        type="checkbox"
        checked={isStoreSelected(Number(store.storePK))}
        onChange={e => handleStoreCheckboxChange(Number(store.storePK), e.target.checked)}
        disabled={isDisabled}
      />
      {store.storeName} ({store.fullAddress})
    </label>
  ))}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreChainSelector;
