import { useState, useEffect } from 'react'; 

interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useLocation = (): UserLocation => {
  const [location, setLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {

    if (!navigator.geolocation) {
      setLocation({ ...location, error: "Geolocation not supported", loading: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        setLocation({ ...location, error: err.message, loading: false });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []); 

  return location;
};