import { convertStoreXmlToStoreJson } from '../parseXmlToJson';
import { parseStringPromise } from 'xml2js';

jest.mock('xml2js', () => ({
    parseStringPromise: jest.fn(),
}));

describe.only('convertStoreXmlToStoreJson', () => {
    it('should convert valid XML to flat Store[] array with all fields', async () => {
        const xmlInput = `
            <root>
                <chain>
                    <chainId>1</chainId>
                    <chainName>Chain 1</chainName>
                    <subChainId>10</subChainId>
                    <subChainName>SubChain 1</subChainName>
                    <storeId>100</storeId>
                    <storeName>Store A</storeName>
                    <address>Address 1</address>
                </chain>
                <chain>
                    <chainId>2</chainId>
                    <chainName>Chain 2</chainName>
                    <subChainId>20</subChainId>
                    <subChainName>SubChain 2</subChainName>
                    <storeId>200</storeId>
                    <storeName>Store B</storeName>
                    <address>Address 2</address>
                </chain>
            </root>
        `;
        (parseStringPromise as jest.Mock).mockResolvedValueOnce({
            root: {
                chain: [
                    {
                        chainId: ['1'],
                        chainName: ['Chain 1'],
                        subChainId: ['10'],
                        subChainName: ['SubChain 1'],
                        storeId: ['100'],
                        storeName: ['Store A'],
                        address: ['Address 1']
                    },
                    {
                        chainId: ['2'],
                        chainName: ['Chain 2'],
                        subChainId: ['20'],
                        subChainName: ['SubChain 2'],
                        storeId: ['200'],
                        storeName: ['Store B'],
                        address: ['Address 2']
                    }
                ]
            }
        });

        const expected = [
            {
                chainId: 1,
                chainName: 'Chain 1',
                subChainId: 10,
                subChainName: 'SubChain 1',
                storeId: 100,
                storeName: 'Store A',
                address: 'Address 1',
                city: '',
                zipCode: ''
            },
            {
                chainId: 2,
                chainName: 'Chain 2',
                subChainId: 20,
                subChainName: 'SubChain 2',
                storeId: 200,
                storeName: 'Store B',
                address: 'Address 2',
                city: '',
                zipCode: ''
            }
        ];

        const result = await convertStoreXmlToStoreJson(xmlInput);
        expect(result).toEqual(expected);
    });

    it('should throw error for undefined input', async () => {
        await expect(convertStoreXmlToStoreJson(undefined as any))
            .rejects
            .toThrow('שגיאה: קלט XML לא מוגדר או ריק');
    });

    it('should throw error for empty input', async () => {
        await expect(convertStoreXmlToStoreJson(''))
            .rejects
            .toThrow('שגיאה: קלט XML לא מוגדר או ריק');
    });

    it('should throw error for invalid XML', async () => {
        (parseStringPromise as jest.Mock).mockRejectedValueOnce(new Error('Parse error'));
        await expect(convertStoreXmlToStoreJson('<root><chain></root>'))
            .rejects
            .toThrow(/שגיאה בניתוח קובץ XML/);
    });
});