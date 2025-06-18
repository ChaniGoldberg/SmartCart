import { parseStoresXml, parseXmlFileToObject, normalizeOsheradData } from '../osherad/parse_stores';
import * as fs from 'fs';

// לא עושים jest.mock('fs')!
// כן עושים מוק ל-xml2js
jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn(),
}));

describe('Osherad Stores Parsing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseXmlFileToObject', () => {
    it('ממיר XML לאובייקט', async () => {
      jest.spyOn(fs.promises, 'readFile').mockResolvedValue('<Root></Root>');
      jest.spyOn(require('xml2js'), 'parseStringPromise').mockResolvedValue({ Root: { foo: 'bar' } });

      const result = await parseXmlFileToObject('dummy.xml');
      expect(result).toEqual({ Root: { foo: 'bar' } });
      expect(fs.promises.readFile).toHaveBeenCalledWith('dummy.xml', 'utf-8');
      expect(require('xml2js').parseStringPromise).toHaveBeenCalled();
    });
  });

  describe('normalizeOsheradData', () => {
    it('מסדר אובייקט גולמי למבנה היררכי', () => {
      const raw = {
        ChainId: '123',
        ChainName: 'אושר עד',
        SubChains: {
          SubChain: [
            {
              SubChainId: '1',
              SubChainName: 'מרכז',
              Stores: {
                Store: [
                  { StoreId: '10', StoreName: 'סניף א', Address: 'רחוב 1' },
                  { StoreId: '11', StoreName: 'סניף ב', Address: 'רחוב 2' }
                ]
              }
            }
          ]
        }
      };
      const result = normalizeOsheradData(raw);
      expect(result).toEqual({
        chainId: '123',
        chainName: 'אושר עד',
        subChains: [
          {
            subChainId: '1',
            subChainName: 'מרכז',
            stores: [
              {
                storeId: '10',
                chainId: '123',
                subChainId: '1',
                storeName: 'סניף א',
                address: 'רחוב 1'
              },
              {
                storeId: '11',
                chainId: '123',
                subChainId: '1',
                storeName: 'סניף ב',
                address: 'רחוב 2'
              }
            ]
          }
        ]
      });
    });
  });

  describe('parseStoresXml', () => {
    it('משלב את כל התהליך ומחזיר אובייקט מסודר', async () => {
      jest.spyOn(fs.promises, 'readFile').mockResolvedValue('<Root></Root>');
      jest.spyOn(require('xml2js'), 'parseStringPromise').mockResolvedValue({
        ChainId: '123',
        ChainName: 'אושר עד',
        SubChains: {
          SubChain: [
            {
              SubChainId: '1',
              SubChainName: 'מרכז',
              Stores: {
                Store: [
                  { StoreId: '10', StoreName: 'סניף א', Address: 'רחוב 1' }
                ]
              }
            }
          ]
        }
      });

      const result = await parseStoresXml();
      expect(result).toEqual({
        chainId: '123',
        chainName: 'אושר עד',
        subChains: [
          {
            subChainId: '1',
            subChainName: 'מרכז',
            stores: [
              {
                storeId: '10',
                chainId: '123',
                subChainId: '1',
                storeName: 'סניף א',
                address: 'רחוב 1'
              }
            ]
          }
        ]
      });
    });
  });
});

