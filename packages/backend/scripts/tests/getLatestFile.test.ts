import { getLatestFile } from '../Rami-Levi/getLatestFile';
import * as fs from 'fs/promises';

// יוצרים mock ל־fs כדי שלא יקרא קבצים אמיתיים
jest.mock('fs/promises');

describe('getLatestFile', () => {
  const mockFiles = [
    'PriceFull7290058140886-001-20230601.xml',
    'PriceFull7290058140886-001-20230605.xml',
    'PriceFull7290058140886-002-20230530.xml',
    'PriceFull7290058140886-001-20230528.xml',
  ];

  beforeEach(() => {
    (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
  });

  it('should return the latest file for given storeId', async () => {
    const latestFile = await getLatestFile('001');
    expect(latestFile).toBe('PriceFull7290058140886-001-20230605.xml');
  });

  it('should return null if no files for the storeId', async () => {
    const latestFile = await getLatestFile('999');
    expect(latestFile).toBeNull();
  });

  it('should return null if no files at all', async () => {
    (fs.readdir as jest.Mock).mockResolvedValue([]);
    const latestFile = await getLatestFile('001');
    expect(latestFile).toBeNull();
  });
});
