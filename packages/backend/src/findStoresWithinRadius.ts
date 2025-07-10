import { useUserLocation } from "frontend/src/hooks/useUserLocation";
import { getValidStores } from "./services/storeService";

interface Location {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}
export async function findStoresWithinRadius(Userlocation: Location, radius: number) {
    console.log("start findStoresWithinRadius", Userlocation, radius);

    const storeLocation = await getValidStores();
    const distances = [];

    for (const store of storeLocation) {
        if (Userlocation.latitude !== null && Userlocation.longitude !== null && store.latitude !== null && store.longitude !== null) {
            console.log("Calculating distance for store:", store);

            const distance = haversine(Userlocation.latitude, Userlocation.longitude, store.latitude, store.longitude);
            if (distance <= radius) {
                console.log("Store within radius:", store, "Distance:", distance);

                distances.push({ store, distance });
            }
        }
        else {
console.log("kkk");
        }
    }

console.log("Stores within radius:", distances);

    return distances;

    function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
        const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
        const R = 6371; // רדיוס כדור הארץ בקילומטרים
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        console.log("Calculated haversine distance:", R * c, "km");

        return R * c; // המרחק בקילומטרים
    }
}
