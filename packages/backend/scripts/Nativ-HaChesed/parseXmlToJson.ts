import { parseStringPromise } from 'xml2js';
import { Store, Chain, SubChain } from '../../../shared/dist/stores';

export async function convertStoreXmlToStoreJson(contentXML: string): Promise<Store[] | string> {
     if (!contentXML) {
        return 'Error: Input XML is undefined or empty';
    }
    try {
        const dataJson = await parseStringPromise(contentXML);
           const chainsArr = Array.isArray(dataJson.root.chain) ? dataJson.root.chain : [dataJson.root.chain];

        const allchains: Chain[] = chainsArr.map((chainObj: any) => ({
            chainId: chainObj.chainId[0],
            chainName: chainObj.chainName[0],
            subchains: chainObj.subchains[0].subchain.map((subchainObj: any): SubChain => ({
                subChainId: subchainObj.subChainId[0],
                subChainName: subchainObj.subChainName[0],
                stores: subchainObj.stores[0].store.map((storeObj: any): Store => ({
                    storeId: storeObj.storeId[0],
                    chainId: chainObj.chainId[0],
                    subChainId: subchainObj.subChainId[0],
                    storeName: storeObj.storeName[0],
                    address: storeObj.address[0]
                }))
            }))
        }))

        const allStores: Store[] = allchains.flatMap((chain:any) =>
            chain.subchains.flatMap((subchain:any) =>subchain.stores)

        )
        return allStores
    } catch (error) {
        return 'Error parsing XML file' + error
    }
}
