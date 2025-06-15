import { getLatestStoreFile } from "./storeUtils";

describe('getLatestStoreFile', () => {
  it('should return the file with the latest timestamp', () => {
    const files = [
      'Stores7290103152017-202506100805.xml',
      'Stores7290103152017-202506110805.xml',
      'Stores7290103152017-202506120805.xml'
    ];

    const result = getLatestStoreFile(files);

    expect(result).toBe('Stores7290103152017-202506120805.xml');
  });

  it('should return null for an empty array', () => {
    const files: string[] = [];

    const result = getLatestStoreFile(files);

    expect(result).toBeNull();
  });
});
