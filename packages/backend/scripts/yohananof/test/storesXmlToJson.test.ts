import { jest } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import { parseXmlFileToObject, normalizeOsheradData, parseStoresXml } from '../storesXmlToJson'; // החלף בשם הקובץ שלך

// Mock של fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

// Mock של path module
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/'))
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe('XML Parser Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock של console.log ו console.error
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('parseXmlFileToObject', () => {
    it('should parse XML file successfully', async () => {
      // Sample XML data
      const mockXmlData = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Root>
          <ChainId>123</ChainId>
          <ChainName>Test Chain</ChainName>
          <SubChains>
            <SubChain>
              <SubChainId>456</SubChainId>
              <SubChainName>Test SubChain</SubChainName>
            </SubChain>
          </SubChains>
        </Root>
      `;

      mockFs.readFile.mockResolvedValueOnce(mockXmlData);

      const result = await parseXmlFileToObject('test.xml');
      
      expect(mockFs.readFile).toHaveBeenCalledWith('test.xml', 'utf-8');
      expect(result).toHaveProperty('ChainId', '123');
      expect(result).toHaveProperty('ChainName', 'Test Chain');
      expect(result.SubChains.SubChain).toHaveProperty('SubChainId', '456');
    });

    it('should handle file read error', async () => {
      mockFs.readFile.mockRejectedValueOnce(new Error('File not found'));

      await expect(parseXmlFileToObject('nonexistent.xml')).rejects.toThrow('File not found');
    });

    it('should handle invalid XML', async () => {
      const invalidXml = '<Root><unclosed>';
      mockFs.readFile.mockResolvedValueOnce(invalidXml);

      await expect(parseXmlFileToObject('invalid.xml')).rejects.toThrow();
    });
  });

  describe('normalizeOsheradData', () => {
    it('should normalize data with single subchain and single store', () => {
      const mockData = {
        ChainId: '123',
        ChainName: 'Test Chain',
        SubChains: {
          SubChain: {
            SubChainId: '456',
            SubChainName: 'Test SubChain',
            Stores: {
              Store: {
                StoreId: '789',
                StoreName: 'Test Store',
                Address: 'Test Address'
              }
            }
          }
        }
      };

      const result = normalizeOsheradData(mockData);

      expect(result.chainId).toBe('123');
      expect(result.chainName).toBe('Test Chain');
      expect(result.subChains).toHaveLength(1);
      expect(result.subChains[0].subChainId).toBe('456');
      expect(result.subChains[0].stores).toHaveLength(1);
      expect(result.subChains[0].stores[0]).toEqual({
        storeId: '789',
        chainId: '123',
        subChainId: '456',
        storeName: 'Test Store',
        address: 'Test Address'
      });
    });

    it('should normalize data with multiple subchains and stores', () => {
      const mockData = {
        ChainId: '123',
        ChainName: 'Test Chain',
        SubChains: {
          SubChain: [
            {
              SubChainId: '456',
              SubChainName: 'SubChain 1',
              Stores: {
                Store: [
                  {
                    StoreId: '789',
                    StoreName: 'Store 1',
                    Address: 'Address 1'
                  },
                  {
                    StoreId: '790',
                    StoreName: 'Store 2',
                    Address: 'Address 2'
                  }
                ]
              }
            },
            {
              SubChainId: '457',
              SubChainName: 'SubChain 2',
              Stores: {
                Store: {
                  StoreId: '791',
                  StoreName: 'Store 3',
                  Address: 'Address 3'
                }
              }
            }
          ]
        }
      };

      const result = normalizeOsheradData(mockData);

      expect(result.subChains).toHaveLength(2);
      expect(result.subChains[0].stores).toHaveLength(2);
      expect(result.subChains[1].stores).toHaveLength(1);
    });

    it('should handle empty SubChains', () => {
      const mockData = {
        ChainId: '123',
        ChainName: 'Test Chain',
        SubChains: {}
      };

      const result = normalizeOsheradData(mockData);

      expect(result.subChains).toHaveLength(0);
    });

    it('should handle missing SubChains property', () => {
      const mockData = {
        ChainId: '123',
        ChainName: 'Test Chain'
      };

      const result = normalizeOsheradData(mockData);

      expect(result.subChains).toHaveLength(0);
    });

    it('should handle subchain without stores', () => {
      const mockData = {
        ChainId: '123',
        ChainName: 'Test Chain',
        SubChains: {
          SubChain: {
            SubChainId: '456',
            SubChainName: 'Test SubChain',
            Stores: {}
          }
        }
      };

      const result = normalizeOsheradData(mockData);

      expect(result.subChains[0].stores).toHaveLength(0);
    });
  });

  describe('parseStoresXml', () => {
    it('should execute full process successfully', async () => {
      const mockXmlData = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Root>
          <ChainId>123</ChainId>
          <ChainName>Test Chain</ChainName>
          <SubChains>
            <SubChain>
              <SubChainId>456</SubChainId>
              <SubChainName>Test SubChain</SubChainName>
              <Stores>
                <Store>
                  <StoreId>789</StoreId>
                  <StoreName>Test Store</StoreName>
                  <Address>Test Address</Address>
                </Store>
              </Stores>
            </SubChain>
          </SubChains>
        </Root>
      `;

      mockFs.readFile.mockResolvedValueOnce(mockXmlData);
      mockFs.writeFile.mockResolvedValueOnce(undefined);

      await parseStoresXml();

      expect(mockFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('Stores7290103152017-202506100805.xml'),
        'utf-8'
      );
      
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('stores.json'),
        expect.stringContaining('"chainId": "123"'),
        'utf-8'
      );

      expect(console.log).toHaveBeenCalledWith('stores.json created successfully');
    });

    it('should handle errors and log them', async () => {
      mockFs.readFile.mockRejectedValueOnce(new Error('File not found'));

      await parseStoresXml();

      expect(console.error).toHaveBeenCalledWith('An error occurred:', expect.any(Error));
    });

    it('should write correct JSON structure', async () => {
      const mockXmlData = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Root>
          <ChainId>7290103152017</ChainId>
          <ChainName>אושר עד</ChainName>
          <SubChains>
            <SubChain>
              <SubChainId>001</SubChainId>
              <SubChainName>אושר עד רגיל</SubChainName>
              <Stores>
                <Store>
                  <StoreId>001</StoreId>
                  <StoreName>אושר עד חיפה</StoreName>
                  <Address>רחוב הרצל 123 חיפה</Address>
                </Store>
              </Stores>
            </SubChain>
          </SubChains>
        </Root>
      `;

      mockFs.readFile.mockResolvedValueOnce(mockXmlData);
      mockFs.writeFile.mockResolvedValueOnce(undefined);

      await parseStoresXml();

      const writeFileCall = mockFs.writeFile.mock.calls[0];
      const writtenData = JSON.parse(writeFileCall[1] as string);

      expect(writtenData).toEqual({
        chainId: '7290103152017',
        chainName: 'אושר עד',
        subChains: [
          {
            subChainId: '001',
            subChainName: 'אושר עד רגיל',
            stores: [
              {
                storeId: '001',
                chainId: '7290103152017',
                subChainId: '001',
                storeName: 'אושר עד חיפה',
                address: 'רחוב הרצל 123 חיפה'
              }
            ]
          }
        ]
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle XML with attributes', async () => {
      const xmlWithAttrs = `
        <Root version="1.0">
          <ChainId type="numeric">123</ChainId>
          <ChainName lang="he">שם הרשת</ChainName>
        </Root>
      `;

      mockFs.readFile.mockResolvedValueOnce(xmlWithAttrs);

      const result = await parseXmlFileToObject('test.xml');
      
      // בדיקה שהאטריביוטים נכללים בתוצאה
      expect(result).toHaveProperty('version', '1.0');
      expect(result.ChainId).toHaveProperty('type', 'numeric');
    });

    it('should handle empty XML elements', async () => {
      const emptyXml = `
        <Root>
          <ChainId></ChainId>
          <ChainName/>
          <SubChains></SubChains>
        </Root>
      `;

      mockFs.readFile.mockResolvedValueOnce(emptyXml);

      const result = await parseXmlFileToObject('test.xml');
      const normalized = normalizeOsheradData(result);

      expect(normalized.chainId).toBe('');
      expect(normalized.chainName).toBe('');
      expect(normalized.subChains).toHaveLength(0);
    });
  });
});