import { getLatestStoreFile } from "./storeUtils";

describe('getLatestStoreFile', () => {
  it('should return the file with the latest timestamp that starts with "Stores"', () => {
    const files = [
      'Stores7290103152017-202506100805.xml',
      'Stores7290103152017-202506110805.xml',
      'Stores7290103152017-202506120805.xml',
      'InvalidStore-202506130805.xml', 
      'stores7290103152017-202506140805.xml' 
    ];

    const result = getLatestStoreFile(files);

    expect(result).toBe('Stores7290103152017-202506120805.xml');
  });

  it('should ignore files that do not start with "Stores"', () => {
    const files = [
      'Store-202506120805.xml',
      'OtherFile-202506130805.xml',
      'stores7290103152017-202506140805.xml'
    ];

    const result = getLatestStoreFile(files);

    expect(result).toBeNull();
  });

  it('should ignore files that have no valid timestamp at the end', () => {
    const files = [
      'Stores-something.xml',
      'Stores-no-date.xml',
      'Stores7290103152017.xml',
      'Stores7290103152017-123.xml'
    ];

    const result = getLatestStoreFile(files);

    expect(result).toBeNull();
  });

  it('should return null for an empty array', () => {
    const files: string[] = [];

    const result = getLatestStoreFile(files);

    expect(result).toBeNull();
  });

  it('should return the latest file when only one is valid', () => {
    const files = [
      'InvalidFile.xml',
      'Stores7290103152017-202506150805.xml',
      'AnotherInvalidFile.txt'
    ];

    const result = getLatestStoreFile(files);

    expect(result).toBe('Stores7290103152017-202506150805.xml');
  });
});
