import { promises as fs } from "fs"
import path from "path"
import { parseStringPromise } from "xml2js"

async function parseXMLPromosFullToJsonFile(xmlContent: string): Promise<any> {
    try {
        const jsonData = await parseStringPromise(xmlContent, {
            explicitArray: false,
            ignoreAttrs: true,
            trim: true,
        });

        const items = jsonData.Root.Items.Item;
        const itemsArray = Array.isArray(items) ? items : [items];

        const result = {
            StoreId: jsonData.Root.StoreId,
            PriceUpdateDate: jsonData.Root.PriceUpdateDate,
            ItemCode: jsonData.Root.ItemCode,
            ItemType: jsonData.Root.ItemType,
            ItemName: jsonData.Root.ItemName,
            ManufacturerName: jsonData.Root.ManufacturerName,
            ManufactureCountry: jsonData.Root.ManufactureCountry,
            ManufacturerItemDescription: jsonData.Root.ManufacturerItemDescription,
            UnitQty: jsonData.Root.UnitQty,
            Quantity: jsonData.Root.Quantity,
            UnitOfMeasure: jsonData.Root.UnitOfMeasure,
            bIsWeighted: jsonData.Root.bIsWeighted,
            QtyInPackage: jsonData.Root.QtyInPackage,
            ItemPrice: jsonData.Root.ItemPrice,
            UnitOfMeasurePrice: jsonData.Root.UnitOfMeasurePrice,
            AllowDiscount: jsonData.Root.AllowDiscount,
            ItemStatus: jsonData.Root.ItemStatus,
            XmlDocVersion: jsonData.Root.XmlDocVersion,
            BikoretNo: jsonData.Root.BikoretNo,
            DllVerNo: jsonData.Root.DllVerNo,
            Promotions: jsonData.Root.Promotions,
            ChainId: jsonData.Root.ChainId,
            SubChainId: jsonData.Root.SubChainId,
            Items: itemsArray.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                amount: item.amount,
                type: item.type
            }))
        };

        return result;
    } catch (error) {
        console.error("Error parsing XML:", error);
        throw error;
    }
}

export {parseXMLPromosFullToJsonFile};






