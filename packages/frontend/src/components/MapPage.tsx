import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserLocation } from '../hooks/useUserLocation';
import { getChainIcon } from '../utils/mapConfig';
import { Promotions } from '../components/promotions';
import { StoreLocationDto } from "@smartcart/shared/src/dto/StoreLocation.dto";

export default function MapPage() {
  const [supermarkets, setSupermarkets] = useState<StoreLocationDto[]>([]);
  const [selectedstore, setSelectedstore] = useState<StoreLocationDto| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, loading: locationLoading, error: locationError } = useUserLocation();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/stores');
        if (!res.ok) throw new Error('קריאת API נכשלה');
        const rawStores = await res.json();
        const processed = rawStores
          .filter((s: any) => s.latitude !== null && s.longitude !== null)
          .map((s: any) => ({
            storePK: s.storePK,
            chainId: s.chainId,
            chainName: s.chainName,
            storeName: s.storeName,
            fullAddress: s.fullAddress || '',
            latitude: s.latitude,
            longitude: s.longitude,
          }));
        setSupermarkets(processed);
      } catch (err: any) {
        console.warn('טעינת API נכשלה:', err.message);
        setError('שגיאה בטעינת רשימת הסניפים');
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
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {supermarkets.map((sup) => (
            <Marker
              key={sup.storePK}
              position={[sup.latitude, sup.longitude]}
              icon={getChainIcon(sup.chainName)}
              eventHandlers={{ click: () => setSelectedstore(sup) }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div>
                  <strong>{sup.chainName}</strong><br />
                  {sup.fullAddress}
                </div>
              </Tooltip>
              <Popup>
                <div style={{ cursor: 'pointer' }}>
                  <strong>רשת: </strong>{sup.chainName}<br />
                  <strong>סניף: </strong>{sup.storeName}<br />
                  <strong>כתובת: </strong>{sup.fullAddress}<br />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {selectedstore && (
        <div style={{
          width: '400px',
          background: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          overflowY: 'auto',
          zIndex: 999,
          padding: '1rem',
          direction: 'rtl'
        }}>
          <button onClick={() => setSelectedstore(null)} style={{
            float: 'left',
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}>
            ❌
          </button>
          {/* <Promotions storePk={selectedstore.toString()} /> */}
          <Promotions storePk={selectedstore.storePK} storeName={selectedstore.storeName} chainName={selectedstore.chainName}/>

        </div>
      )}
    </div>
  );
}


