import { promises as fs } from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';


async function parsePriceFull(filePath: string) {
// קריאת תוכן הקובץ 
 const fileContent = await fs.readFile(filePath, 'utf-8');
  
try {
    // המרת XML ל-JSON
    const jsonData = await parseStringPromise(fileContent, { explicitArray: false });
    const items= jsonData.Root.Items.Item;
    const itemsArray= Array.isArray(items) ? items : [items]; // לוודא ש-Items הוא מערך
    const result={
  ChainId:jsonData.Root.ChainId, 
  StoreId:jsonData.Root.StoreId,
  Items:itemsArray.map((item: any) => ({  
  PriceUpdateDate:item.PriceUpdateDate,
  ItemCode:item.ItemCode,
  ItemType:item.ItemType,
  ItemName:item.ItemName,
  ManufacturerName:item.ManufacturerName,
  ManufactureCountry:item.ManufactureCountry,
  ManufacturerItemDescription:item.ManufacturerItemDescription,
  UnitQty:item.UnitQty,
  Quantity:item.Quantity,
  UnitOfMeasure:item.UnitOfMeasure,
  bIsWeighted:item.bIsWeighted,
  QtyInPackage:item.QtyInPackage,
  ItemPrice:item.ItemPrice,
  UnitOfMeasurePrice:item.UnitOfMeasurePrice,
  AllowDiscount:item.AllowDiscount,
  ItemStatus:item.ItemStatus
        
    }))};

    // כתיבת האוביקט לקובץ
   const outputPath = path.join(path.dirname(filePath), 'PriceFull-parse.json');
   await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
    console.log('Parsed and saved as PriceFull-parse.json');
}
catch (error) {
    console.error('Error parsing XML:', error);throw error;
}

}

parsePriceFull('D:/פרקטיקום/PriceFull.xml');// קריאה לפונקציה
// הפונקציה קוראת את קובץ ה-XML, ממירה אותו ל-JSON ושומרת אותו בקובץ חדש

export { parsePriceFull }

