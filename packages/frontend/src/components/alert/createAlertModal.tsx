// packages/frontend/src/components/alert/createAlertModal.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { ProductDTO } from '@smartcart/shared';
import { StoreLocationDto } from '../../../../shared/src/dto/StoreLocation.dto';
import ProductSearchAndSelection from './productSearchAndSelection';
import StoreChainSelector from './storeChainSelector';
import NotificationMethods from './notificationMethodSelector';
import DiscountAndDistanceSettings from './discountAndDistanceSettings';
import Modal from './modal';
import { getProductsByItemCodeAcrossStoresDummy, getFilteredStores, calculateDistance } from './math'; // ✅ ייבוא הפונקציות הנכונות

// ✅ הגדרת ProductSearchResult כפי שסיפקת - זה נכון
export interface ProductSearchResult {
    item: ProductDTO;
    price: {
        pricePK: string;
        itemCode: string;
        storePK: string;
        price: number;
        promotionId: string | null;
        lastUpdateDate: string;
        originalPrice: number; // חשוב שיהיה כאן לצורך חישוב הנחה
    }
}

interface CreateAlertModalProps {
    onClose: () => void;
    username: string;
    isOpen: boolean;
    onAlertCreated: () => void;
}

// נתוני דמה למוצרים לחיפוש ראשוני.
// אלו הם ProductSearchResult[] כפי שצוין ב-ProductSearchAndSelection
// נתוני ה-dummyProductsAllResults המלאים נמצאים כעת ב-math.ts
const dummyProductsForSearch: ProductSearchResult[] = [
    {
        item: new ProductDTO('P001', 101, 'חלב תנובה 3%', '1', 'חלב 3% - תנובה', true, 'חלב בקר 3% שומן, 1 ליטר', 'תנובה', 6.00, 6.00, 1, 0, undefined),
        price: { pricePK: 'PRC001', itemCode: 'P001', storePK: '1', price: 6.00, promotionId: null, lastUpdateDate: '2025-07-28', originalPrice: 6.00 }
    },
    {
        item: new ProductDTO('P002', 102, 'לחם אנג\'ל אחיד פרוס', '1', 'לחם אחיד פרוס - אנג\'ל', true, 'לחם אחיד פרוס 750 גרם', 'אנג\'ל', 12.50, 16.67, 1, 0, undefined),
        price: { pricePK: 'PRC002', itemCode: 'P002', storePK: '1', price: 12.50, promotionId: null, lastUpdateDate: '2025-07-28', originalPrice: 12.50 }
    },
    {
        item: new ProductDTO('P003', 103, 'שמן זית יד מרדכי', '2', 'שמן זית כתית מעולה - יד מרדכי', true, 'שמן זית כתית מעולה, 750 מ"ל', 'יד מרדכי', 35.00, 46.67, 1, 1, 'מבצע: 2 ב-60 ש"ח'),
        price: { pricePK: 'PRC003', itemCode: 'P003', storePK: '2', price: 35.00, promotionId: 'PROM001', lastUpdateDate: '2025-07-27', originalPrice: 45.00 }
    },
    {
        item: new ProductDTO('P004', 104, 'קפה נמס עלית 200 גרם', '3', 'קפה נמס - עלית', true, 'קפה נמס מגורען, 200 גרם', 'עלית', 28.00, 140.00, 1, 0, undefined),
        price: { pricePK: 'PRC004', itemCode: 'P004', storePK: '3', price: 28.00, promotionId: null, lastUpdateDate: '2025-07-26', originalPrice: 28.00 }
    },
    {
        item: new ProductDTO('P005', 105, 'יוגורט שטראוס ביו', '1', 'יוגורט ביו - שטראוס', true, 'יוגורט ביו טבעי, 200 גרם', 'שטראוס', 4.50, 22.50, 1, 0, undefined),
        price: { pricePK: 'PRC005', itemCode: 'P005', storePK: '1', price: 4.50, promotionId: null, lastUpdateDate: '2025-07-28', originalPrice: 4.50 }
    },
    {
        item: new ProductDTO('P006', 106, 'אורז סוגת בסמטי 1 ק"ג', '2', 'אורז בסמטי - סוגת', true, 'אורז בסמטי הודי, 1 ק"ג', 'סוגת', 15.00, 15.00, 1, 1, 'מבצע: 2 ב-25 ש"ח'),
        price: { pricePK: 'PRC006', itemCode: 'P006', storePK: '2', price: 15.00, promotionId: 'PROM002', lastUpdateDate: '2025-07-27', originalPrice: 20.00 }
    },
];


const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ onClose, username, isOpen, onAlertCreated }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null); // ✅ עדיין ProductDTO גנרי
    const [minDiscount, setMinDiscount] = useState<number>(0);
    const [maxDistance, setMaxDistance] = useState<number>(10);
    const [allStores, setAllStores] = useState<StoreLocationDto[]>([]);
    const [userLatitude, setUserLatitude] = useState<number | null>(null);
    const [userLongitude, setUserLongitude] = useState<number | null>(null);
    const [locationLoading, setLocationLoading] = useState<boolean>(true);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [storesLoading, setStoresLoading] = useState<boolean>(true);

    // ✅ הסטייט הזה עכשיו מכיל ProductSearchResult[]
    const [allProductsForSelectedItem, setAllProductsForSelectedItem] = useState<ProductSearchResult[]>([]); 
    
    const [useAllNearbyStores, setUseAllNearbyStores] = useState<boolean>(true);
    const [selectedStores, setSelectedStores] = useState<number[]>([]);
    
    const [notificationMethods, setNotificationMethods] = useState<('whatsapp' | 'email' | 'sms')[]>(['whatsapp']);

    const handleNotificationMethodChange = useCallback((method: 'whatsapp' | 'email' | 'sms') => {
        setNotificationMethods(prev =>
            prev.includes(method)
                ? prev.filter(m => m !== method)
                : [...prev, method]
        );
    }, []);

    // Effect לקבלת מיקום המשתמש
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLatitude(pos.coords.latitude);
                    setUserLongitude(pos.coords.longitude);
                    setLocationLoading(false);
                    setLocationError(null);
                },
                (err) => {
                    setLocationError('Failed to retrieve your location. Please enable location services.');
                    setLocationLoading(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setLocationError('Geolocation is not supported by your browser.');
            setLocationLoading(false);
        }
    }, []);

    // טעינת נתוני דמה לחנויות
    useEffect(() => {
        const dummyStores: StoreLocationDto[] = [
            { storePK: '1', chainId: 'C001', chainName: 'SuperDeal', storeName: 'SuperDeal - Tel Aviv', fullAddress: 'Dizengoff 100, Tel Aviv', latitude: 32.0853, longitude: 34.7818 },
            { storePK: '2', chainId: 'C002', chainName: 'MegaMarket', storeName: 'MegaMarket - Herzliya', fullAddress: 'Ben Gurion 10, Herzliya', latitude: 32.1663, longitude: 34.8438 },
            { storePK: '3', chainId: 'C003', chainName: 'BudgetMart', storeName: 'BudgetMart - Ramat Gan', fullAddress: 'Jabotinsky 200, Ramat Gan', latitude: 32.0681, longitude: 34.8240 },
        ];
        setAllStores(dummyStores);
        setStoresLoading(false);
    }, []);

    // פונקציית דמה לחיפוש מוצרים - משתמשת ב-dummyProductsForSearch
    const searchProductsForDisplay = useCallback((term: string): ProductSearchResult[] => {
        if (!term) {
            return [];
        }
        const lowerCaseTerm = term.toLowerCase();
        const uniqueProductItemCodes = new Set<string>();
        const uniqueResults: ProductSearchResult[] = [];

        dummyProductsForSearch.forEach(productResult => {
            if (!uniqueProductItemCodes.has(productResult.item.itemCode) &&
                (productResult.item.ProductName.toLowerCase().includes(lowerCaseTerm) ||
                productResult.item.itemName.toLowerCase().includes(lowerCaseTerm) ||
                productResult.item.itemCode.toLowerCase().includes(lowerCaseTerm) ||
                (productResult.item.manufacturerItemDescription && productResult.item.manufacturerItemDescription.toLowerCase().includes(lowerCaseTerm)))) {
                
                uniqueProductItemCodes.add(productResult.item.itemCode);
                uniqueResults.push(productResult);
            }
        });
        return uniqueResults;
    }, []);

    // useEffect לביצוע חיפוש מוצרים עם נתוני דמה (לחיפוש ראשוני)
    useEffect(() => {
        const timerId = setTimeout(() => {
            if (searchTerm.length > 0) {
                const results = searchProductsForDisplay(searchTerm);
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timerId);
    }, [searchTerm, searchProductsForDisplay]);

    // ✅ Effect חדש: טעינת כל המוצרים עבור ה-itemCode הנבחר, מכל החנויות
    // זה יקרא לפונקציה מ-math.ts
    useEffect(() => {
        if (selectedProduct?.itemCode) {
            const productsAcrossStores = getProductsByItemCodeAcrossStoresDummy(selectedProduct.itemCode);
            setAllProductsForSelectedItem(productsAcrossStores);
        } else {
            setAllProductsForSelectedItem([]);
        }
    }, [selectedProduct]); // תלוי ב-selectedProduct

    const handleCreateAlert = useCallback(async () => {
        if (!selectedProduct) {
            alert('Please select a product first.');
            return;
        }

        if (notificationMethods.length === 0) {
            alert('Please select at least one notification method.');
            return;
        }

        let storesToAlert: number[] = [];
        if (useAllNearbyStores) {
            if (userLatitude === null || userLongitude === null) {
                alert('User location is not available. Cannot select nearby stores.');
                return;
            }
            // ✅ שימוש ב-allProductsForSelectedItem כעת כ-ProductSearchResult[]
           storesToAlert = getFilteredStores(
  selectedProduct,
  allStores,
  allProductsForSelectedItem, 
  userLatitude,
  userLongitude,
  maxDistance,
  minDiscount
).map(s => Number(s.storePK));

            
        } else {
            storesToAlert = selectedStores;
        }

        if (storesToAlert.length === 0) {
            alert('Please select at least one store or enable "All Nearby Stores" and ensure products are available within criteria.');
            return;
        }

        try {
            const payload = {
                productCode: selectedProduct.itemCode,
                minDiscount,
                maxDistance,
                userLatitude,
                userLongitude,
                storesToAlert: storesToAlert,
                notificationMethods,
                username: username,
            };

            console.log('CreateAlertModal: Simulating sending notification payload:', payload);

            const newNotification = { id: 'DUMMY_ID_123', ...payload, status: 'created' };
            
            console.log('Notification created successfully (simulated):', newNotification);
            alert('Alert created successfully!');
            onAlertCreated();
            onClose();
        } catch (error: any) {
            console.error('Failed to create alert (simulated):', error);
            alert(`Failed to create alert: ${error.message || 'An unknown error occurred'}.`);
        }
    }, [
        selectedProduct, minDiscount, maxDistance, userLatitude, userLongitude,
        useAllNearbyStores, allStores, selectedStores, notificationMethods, username,
        onAlertCreated, onClose, allProductsForSelectedItem
    ]);

    const isFormDisabled = locationLoading || storesLoading || locationError !== null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 style={{ marginBottom: '25px', color: '#333', textAlign: 'center' }}>Create Alert</h2>

            {(locationLoading || storesLoading) && <p style={{ textAlign: 'center', color: '#007bff' }}>Loading data...</p>}
            {(locationError) && (
                <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px', padding: '10px', border: '1px solid red', borderRadius: '5px', backgroundColor: '#ffe6e6' }}>
                    {locationError && <p>Location Error: {locationError}</p>}
                </div>
            )}

            <ProductSearchAndSelection
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                searchResults={searchResults} setSearchResults={setSearchResults}
                selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}
                minDiscount={minDiscount} maxDistance={maxDistance}
                allStores={allStores} userLatitude={userLatitude} userLongitude={userLongitude}
                isFormDisabled={isFormDisabled}
            />

            <DiscountAndDistanceSettings
                minDiscount={minDiscount} setMinDiscount={setMinDiscount}
                maxDistance={maxDistance} setMaxDistance={setMaxDistance}
                isFormDisabled={isFormDisabled}
            />

            {/* ✅ StoreChainSelector מקבל כעת allProductsForSelectedItem מסוג ProductSearchResult[] */}
    <StoreChainSelector
  selectedProduct={selectedProduct}
  allStores={allStores}
  // ⛔️ הסר את השורה הזו:
  // allProductsForSelectedItem={allProductsForSelectedItem}
  userLatitude={userLatitude}
  userLongitude={userLongitude}
  maxDistance={maxDistance}
  minDiscount={minDiscount}
  useAllNearbyStores={useAllNearbyStores}
  setUseAllNearbyStores={setUseAllNearbyStores}
  selectedStores={selectedStores}
  setSelectedStores={setSelectedStores}
  isLoading={storesLoading}
  locationLoading={locationLoading}
  locationError={locationError}
  isFormDisabled={isFormDisabled}
/>


            <NotificationMethods
                notificationMethods={notificationMethods}
                isFormDisabled={isFormDisabled}
                handleNotificationMethodChange={handleNotificationMethodChange}
            />

            <button
                onClick={handleCreateAlert}
                // כפתור מנוטרל אם אין מוצר נבחר, או אם יש שגיאת מיקום/טעינה, או אם אין חנויות שנבחרו/קרובות
                disabled={isFormDisabled || !selectedProduct || (selectedStores.length === 0 && !useAllNearbyStores)}
                style={{
                    width: '100%', padding: '12px 20px', backgroundColor: '#28a745', color: 'white',
                    border: 'none', borderRadius: '5px', fontSize: '18px',
                    marginTop: '20px', cursor: (isFormDisabled || !selectedProduct || (selectedStores.length === 0 && !useAllNearbyStores)) ? 'not-allowed' : 'pointer',
                    opacity: (isFormDisabled || !selectedProduct || (selectedStores.length === 0 && !useAllNearbyStores)) ? 0.6 : 1
                }}
            >
                Create Alert
            </button>
        </Modal>
    );
};

export default CreateAlertModal;