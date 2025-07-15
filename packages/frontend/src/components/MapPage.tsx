import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserLocation } from '../hooks/useUserLocation';
import { getChainIcon } from '../utils/mapConfig';
import { Promotions } from '../components/promotions';

interface SupermarketLocation {
  storeId: string ;
  chainId: string | number;
  chainName: string;
  storeName: string;
  address: string;
  lat: number;
  lng: number;
}

const mockDb: { Store: SupermarketLocation[] } = {
  Store: [
    {
      storeId: '106',
      chainId: 72902255282,
      chainName: 'רמי לוי',
      storeName: 'רמי לוי בית שמש',
      address: 'שדרות יגאל אלון 4, בית שמש',
      lat: 31.761653003944758,
      lng: 34.985794208108466
    },
    {
      storeId: '101',
      chainId: 72902255282,
      chainName: 'אושר עד',
      storeName: 'אושר עד מורדי הגטאות',
      address: 'מורדי הגטאות 6, בית שמש',
      lat: 31.747761936584563,
      lng: 34.992656753685374
    },
    {
      storeId: '102',
      chainId: 72902255282,
      chainName: 'נתיב החסד',
      storeName: 'נתיב החסד נחל שורק 11',
      address: 'נחל שורק 11, בית שמש',
      lat: 31.715218955139534,
      lng: 34.994083976997516
    },
    {
      storeId: '103',
      chainId: 72902255282,
      chainName: 'נתיב החסד',
      storeName: 'נתיב החסד מרים הנביאה 16',
      address: 'מרים הנביאה 16, בית שמש',
      lat: 31.701877510531983,
      lng: 34.99287640398305
    }
  ]
};

export default function MapPage() {
  const [supermarkets, setSupermarkets] = useState<SupermarketLocation[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, loading: locationLoading, error: locationError } = useUserLocation();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('/api/stores');
        if (!res.ok) throw new Error('קריאת API נכשלה');
        const rawStores = await res.json();

        const processed = rawStores
          .filter((s: any) => s.latitude !== null && s.longitude !== null)
          .map((s: any) => ({
            storeId: s.storeId,
            chainId: s.chainId,
            chainName: s.chainName,
            storeName: s.storeName,
            address: s.fullAddress || '',
            lat: s.latitude,
            lng: s.longitude,
          }));

        setSupermarkets(processed);
      } catch (err: any) {
        console.warn('טעינת API נכשלה. טוען מוק:', err.message);
        setSupermarkets(mockDb.Store);
        setError('שגיאה בטעינת רשימת הסניפים - נטען מידע חלופי');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading || locationLoading) return <div>טוען נתונים...</div>;
  if (locationError) return <div>שגיאה בקבלת מיקום: {locationError}</div>;
  if (!latitude || !longitude) return <div>לא ניתן לקבוע מיקום משתמש</div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* מפה */}
      <div style={{ flex: 1 }}>
        <MapContainer center={[latitude, longitude]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {supermarkets.map((sup) => (
            <Marker
              key={sup.storeId}
              position={[sup.lat, sup.lng]}
              icon={getChainIcon(sup.chainName)}
              eventHandlers={{
                click: () => setSelectedStoreId(sup.storeId),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div>
                  <strong>{sup.chainName}</strong><br />
                  {sup.address}
                </div>
              </Tooltip>
              <Popup>
                <div style={{ cursor: 'pointer' }}>
                  <strong>רשת: </strong>{sup.chainName}<br />
                  <strong>סניף: </strong>{sup.storeName}<br />
                  <strong>כתובת: </strong>{sup.address}<br />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* פאנל מבצעים */}
      {selectedStoreId && (
        <div style={{
          width: '400px',
          background: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          overflowY: 'auto',
          zIndex: 999,
          padding: '1rem',
          direction: 'rtl'
        }}>
          <button onClick={() => setSelectedStoreId("")} style={{
            float: 'left',
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}>
            ❌
          </button>
          <Promotions storePk={selectedStoreId} />

        </div>
      )}
    </div>
  );
}