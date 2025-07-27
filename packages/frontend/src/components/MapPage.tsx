import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserLocation } from '../hooks/useUserLocation';
import { getChainIcon } from '../utils/mapConfig';
import { Promotions } from '../components/promotions';
import { StoreLocationDto } from "@smartcart/shared";

export default function MapPage() {
  const [supermarkets, setSupermarkets] = useState<StoreLocationDto[]>([]);
  const [selectedstore, setSelectedstore] = useState<StoreLocationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, loading: locationLoading, error: locationError } = useUserLocation();
  const [searchWord, setSearchWord] = useState<string>("");
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/stores`);
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
        setError('שגיאה בטעינת רשימת הסניפים');
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // פונקציית גאוקודינג עם OpenStreetMap Nominatim
  const geocode = async (query: string): Promise<[number, number] | null> => {
    try {
      const url = `${process.env.REACT_APP_NOMINATIM_URL}${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSearch = async () => {
    const search = searchWord.trim().toLowerCase();
    if (!search) {
      alert('אנא הכנס מחרוזת לחיפוש');
      return;
    }

    const found = supermarkets.find((store) =>
      store.storeName.toLowerCase().includes(search) ||
      store.fullAddress.toLowerCase().includes(search)
    );

    if (found) {
      setPosition([found.latitude, found.longitude]);
    } else {
      // אם לא נמצא סניף, מחפשים בגאוקודינג
      const geoPos = await geocode(searchWord);
      if (geoPos) {
        setPosition(geoPos);
        setSelectedstore(null);
      } else {
        alert('לא נמצא סניף או מיקום מתאים לחיפוש');
      }
    }
  };

  function FlyToPosition({ position }: { position: [number, number] | null }) {
    const map = useMap();
    React.useEffect(() => {
      if (position) {
        map.flyTo(position, 15);
      }
    }, [position, map]);
    return null;
  }

  if (loading || locationLoading) return <div>טוען נתונים...</div>;
  if (locationError) return <div>שגיאה בקבלת מיקום: {locationError}</div>;
  if (!latitude || !longitude) return <div>לא ניתן לקבוע מיקום משתמש</div>;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '60px',
              zIndex: 1000,
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'row-reverse',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="חפש סניף / כתובת / מיקום..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              style={{
                    minWidth: '220px', // ✅ שינוי כאן

                flex: 1,
                padding: '8px',
                fontSize: '1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                direction: 'rtl',
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: '8px 12px',
                fontSize: '1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
              }}
            >
              🔍 חיפוש
            </button>
          </div>

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
            <FlyToPosition position={position} />
          </MapContainer>
        </div>
      </div>
      {selectedstore && (
        <div
          style={{
            width: '400px',
            background: '#fff',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            overflowY: 'auto',
            zIndex: 999,
            padding: '1rem',
            direction: 'rtl',
          }}
        >
          <button
            onClick={() => setSelectedstore(null)}
            style={{
              float: 'left',
              background: 'transparent',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
          >
            ❌
          </button>
          <Promotions
            storePk={selectedstore.storePK}
            storeName={selectedstore.storeName}
            chainName={selectedstore.chainName}
          />
        </div>
      )}
    </div>
  );
}
