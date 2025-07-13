import { findStoresWithinRadius } from './findStoresWithinRadius';
import * as storeService from '../src/services/storeService';

// Mocking the storeService module
jest.mock('../src/services/storeService', () => ({
    getValidStores: jest.fn(), // כאן אתה מגדיר את הפונקציה כ-Mock
}));

describe('findStoresWithinRadius', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // לנקות את ה-Mocks לפני כל בדיקה
    });

    it('should return stores within the specified radius', async () => {
        const userLocation = { latitude: 32.0, longitude: 34.0, error: null, loading: false };
        const radius = 100;
        const mockStores = [
            { latitude: 32.1, longitude: 34.1 },
            { latitude: 32.5, longitude: 34.5 },
            { latitude: 31.0, longitude: 33.0 },
        ];
        
        (storeService.getValidStores as jest.Mock).mockResolvedValue(mockStores);

        const result = await findStoresWithinRadius(userLocation, radius);

        expect(result).toHaveLength(2); // Assuming first two stores are within the radius
        expect(result[0].store).toEqual(mockStores[0]);
        expect(result[1].store).toEqual(mockStores[1]);
    });

    it('should return an empty array if no stores are within the radius', async () => {
        const userLocation = { latitude: 32.0, longitude: 34.0, error: null, loading: false };
        const radius = 1;
        const mockStores = [
            { latitude: 35.0, longitude: 36.0 },
            { latitude: 40.0, longitude: 41.0 },
        ];

        (storeService.getValidStores as jest.Mock).mockResolvedValue(mockStores);

        const result = await findStoresWithinRadius(userLocation, radius);

        expect(result).toHaveLength(0);
    });

    it('should handle null coordinates', async () => {
        const userLocation = { latitude: null, longitude: null, error: null, loading: false };
        const radius = 10;
        const mockStores = [
            { latitude: 32.1, longitude: 34.1 },
        ];

        (storeService.getValidStores as jest.Mock).mockResolvedValue(mockStores);

        const result = await findStoresWithinRadius(userLocation, radius);

        expect(result).toHaveLength(0); // Should return empty since user location is null
    });
});
