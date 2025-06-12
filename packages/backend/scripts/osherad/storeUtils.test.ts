
import { getLatestStoreFile } from "./storeUtils";

describe('getLatestStoreFile', () => {
  it('should return the file with the latest timestamp from valid Stores files', () => {
    const files = [
      'Stores7290103152017-202506100805.xml',
      'Stores7290103152017-202506110805.xml',
      'Stores7290103152017-202506120805.xml'
    ];

    const result = getLatestStoreFile(files);

    expect(result).toBe('Stores7290103152017-202506120805.xml');
  });

  it('should return null if no valid Stores files are present', () => {
    const files = [
      'Report_202506100805.csv',
      'StoreFile202506110805.xml',
      'OtherFile.xml'
    ];

    const result = getLatestStoreFile(files);

    expect(result).toBeNull();
  });

  it('should ignore files with invalid timestamp formats', () => {
    const files = [
      'Stores7290103152017-20250612080.xml', // too short
      'Stores7290103152017-2025061208055.xml', // too long
      'Stores7290103152017-abcdefghijklmno.xml' // not numeric
    ];

    const result = getLatestStoreFile(files);

    expect(result).toBeNull();
  });
});
