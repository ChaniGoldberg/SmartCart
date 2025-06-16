import * as xml2js from "xml2js";
import fs from "fs";
import { Chain, Store, SubChain } from '@smartcart/shared/src/stores';

export async function parseXmlToJson(xmlContent: string): Promise<object | undefined> {
    try {
        if (!xmlContent) {
            throw new Error("Invalid XML content");
        }
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlContent);
        return cleanJsonObjects(result);
    } catch (err) {
        throw new Error(String(err));
    }
}

export async function cleanJsonObjects(obj: any): Promise<object | undefined> {
    try {
        const cleanedData: Chain = { chainId: "", chainName: "", lastUpdateDate: new Date(), subChains: [] };
        const dateofUpdate = new Date()
        const chainId = obj.Root.ChainID[0]
        let subChainId = ""
        dateofUpdate.setDate(obj.Root.LastUpdateDate[0])
        dateofUpdate.setTime(obj.Root.LastUpdateTime[0])
        cleanedData.chainId = obj.Root.ChainID[0]
        cleanedData.chainName = obj.Root.ChainName[0]
        cleanedData.lastUpdateDate = dateofUpdate
        obj.Root.SubChain.map((subchain: any) => {
            const mySubChain: SubChain = { subChainId: "", subChainName: "", stores: [] }
            subChainId = subchain.SubChainID[0]
            mySubChain.subChainId = subchain.SubChainID[0]
            mySubChain.subChainName = subchain.SubChainName[0]
            obj.Root.Stores.map((store: any) => {
                const myStore: Store = { storeId: "", chainId: "", subChainId: "", storeName: "", address: "", city: "", zipCode: "" }
                myStore.chainId = cleanedData.chainId
                myStore.subChainId = subChainId
                myStore.storeId = store.StoreID[0]
                myStore.storeName = store.StoreName[0]
                myStore.address = store.Address[0]
                myStore.city = store.City[0]
                myStore.zipCode = store.ZipCode[0]
                mySubChain.stores.push(myStore)
            })
            cleanedData.subChains.push(mySubChain)
        })
        return cleanedData;
    } catch (error) {
        console.error("Error cleaning JSON objects:", error);
    }
}
