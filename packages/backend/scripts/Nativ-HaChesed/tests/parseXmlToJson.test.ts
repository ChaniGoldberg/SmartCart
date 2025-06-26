import { convertStoreXmlToStoreJson } from '../parseXmlToJson';
import { parseStringPromise } from 'xml2js';

jest.mock('xml2js', () => ({
    parseStringPromise: jest.fn(),
}));

describe('convertStoreXmlToStoreJson', () => {
    it('should convert valid XML to flat Store[] array with all fields', async () => {
        const xmlInput = `
            <root>
                <chain>
                    <chainId>1</chainId>
                    <chainName>Chain 1</chainName>
                    <lastUpdateDate>2025-06-26</lastUpdateDate>
                    <subchains>
                        <subchain>
                            <subChainId>10</subChainId>
                            <subChainName>SubChain 1</subChainName>
                            <stores>
                                <store>
                                    <storeId>100</storeId>
                                    <storeName>Store A</storeName>
                                    <address>Address 1</address>
                                    <city>Tel Aviv</city>
                                    <zipCode>12345</zipCode>
                                </store>
                                <store>
                                    <storeId>101</storeId>
                                    <storeName>Store B</storeName>
                                    <address>Address 2</address>
                                </store>
                            </stores>
                        </subchain>
                    </subchains>
                </chain>
            </root>
        `;
        (parseStringPromise as jest.Mock).mockResolvedValueOnce({
            root: {
                chain: [{
                    chainId: ['1'],
                    chainName: ['Chain 1'],
                    lastUpdateDate: ['2025-06-26'],
                    subchains: [{
                        subchain: [{
                            subChainId: ['10'],
                            subChainName: ['SubChain 1'],
                            stores: [{
                                store: [
                                    { storeId: ['100'], storeName: ['Store A'], address: ['Address 1'], city: ['Tel Aviv'], zipCode: ['12345'] },
                                    { storeId: ['101'], storeName: ['Store B'], address: ['Address 2'] }
                                ]
                            }]
                        }]
                    }]
                }]
            }
        });

        const expected = [
            { storeId: '100', chainId: '1', subChainId: '10', storeName: 'Store A', address: 'Address 1', city: 'Tel Aviv', zipCode: '12345' },
            { storeId: '101', chainId: '1', subChainId: '10', storeName: 'Store B', address: 'Address 2', city: '', zipCode: '' }
        ];

        const result = await convertStoreXmlToStoreJson(xmlInput);
        expect(result).toEqual(expected);
    });

    it('should return error for undefined input', async () => {
        const result = await convertStoreXmlToStoreJson(undefined as any);
        expect(result).toBe('Error: Input XML is undefined or empty');
    });

    it('should return error for empty input', async () => {
        const result = await convertStoreXmlToStoreJson('');
        expect(result).toBe('Error: Input XML is undefined or empty');
    });

    it('should return error for invalid XML', async () => {
        (parseStringPromise as jest.Mock).mockRejectedValueOnce(new Error('Parse error'));
        const result = await convertStoreXmlToStoreJson('<root><chain></root>');
        expect(result).toMatch(/Error parsing XML file/);
    });
});