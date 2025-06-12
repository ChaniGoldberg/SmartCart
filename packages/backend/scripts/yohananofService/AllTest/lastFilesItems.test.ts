// 



import { lastFileForStoreId } from '../lastFilesItem';

describe('lastFileForStoreId', () => {
  it('should return the latest date for the given storeId', async () => {
    const allFiles = [
      'PriceFull-123-20231025.gz',
      'PriceFull-123-20231027.gz',
      'PriceFull-123-20231026.gz',
      'PriceFull-999-20231030.gz'
    ];
    const storeId = '123';
    const result = await lastFileForStoreId(allFiles, storeId);
    expect(result).toBe('20231027');
  });

  it('should return undefined if no files match the storeId', async () => {
    const allFiles = [
      'PriceFull-999-20231030.gz',
      'PriceFull-888-20231031.gz'
    ];
    const storeId = '123';
    const result = await lastFileForStoreId(allFiles, storeId);
    expect(result).toBeUndefined();
  });

  it('should return undefined if no files start with "PriceFull"', async () => {
    const allFiles = [
      'PromoFull-123-20231025.gz',
      'PromoFull-123-20231026.gz'
    ];
    const storeId = '123';
    const result = await lastFileForStoreId(allFiles, storeId);
    expect(result).toBeUndefined();
  });

  it('should handle empty input list', async () => {
    const allFiles: string[] = [];
    const storeId = '123';
    const result = await lastFileForStoreId(allFiles, storeId);
    expect(result).toBeUndefined();
  });

  it('should return the only matching date if there is one file', async () => {
    const allFiles = [
      'PriceFull-123-20240101.gz'
    ];
    const storeId = '123';
    const result = await lastFileForStoreId(allFiles, storeId);
    expect(result).toBe('20240101');
  });
});