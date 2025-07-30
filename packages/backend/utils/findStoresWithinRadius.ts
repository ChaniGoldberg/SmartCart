import { useUserLocation } from "frontend/src/hooks/useUserLocation";
import { getStoresWithCoordinates } from "../src/services/storeService";
import { StoreLocationDto } from "@smartcart/shared";

interface Location {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}
export async function findStoresWithinRadius(userlocation: Location, radius: number): Promise<{ store: StoreLocationDto; distance: number }[]>  {

    const storeLocation = await getStoresWithCoordinates();
    const distances: { store: StoreLocationDto; distance: number }[] = []; // טיפוס מפורש

    for (const store of storeLocation) {
        if (userlocation.latitude !== null && userlocation.longitude !== null && store.latitude !== null && store.longitude !== null) {

            const distance = haversine(userlocation.latitude!, userlocation.longitude!, store.latitude!, store.longitude!);
            if (distance <= radius) {

                distances.push({ store, distance });
            }
        }
        else {
        }
    }

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

        return R * c; // המרחק בקילומטרים
    }
}
