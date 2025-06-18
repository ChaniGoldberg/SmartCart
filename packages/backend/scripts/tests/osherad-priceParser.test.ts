import { promises as fs } from 'fs';
import path from 'path';
import { parsePriceFull } from '../osherad/priceFull-Parser';



const outputPath = 'D:/פרקטיקום/PriceFull.xml'; // נתיב לקובץ ה-XML המקורי
const jsonPath = path.join(path.dirname(outputPath), 'PriceFull-parse.json');

describe("parsePriceFull", () => {
  beforeAll(async () => {
    await parsePriceFull(outputPath);
   });
it("should create a parsed JSON file", async () => {
    const fileExists = await fs.access(jsonPath)
      .then(() => true)   
      .catch(() => false);
    expect(fileExists).toBe(true);  
  });
  it("should write valid JSON with expected structure", async () => {
    const data = await fs.readFile(jsonPath, 'utf-8');
    const jsonData = JSON.parse(data);
    expect(jsonData).toHaveProperty('Items');
    expect(Array.isArray(jsonData.Items)).toBe(true);
    expect(jsonData.Items.length).toBeGreaterThan(0);
    expect(jsonData).toHaveProperty('ChainId');
    expect(jsonData).toHaveProperty('StoreId');
    expect(jsonData.Items[0]).toHaveProperty('PriceUpdateDate');
    expect(jsonData.Items[0]).toHaveProperty('ItemCode');
    expect(jsonData.Items[0]).toHaveProperty('ItemType');
    expect(jsonData.Items[0]).toHaveProperty('ManufacturerName');
     expect(jsonData.Items[0]).toHaveProperty('ManufactureCountry');
    expect(jsonData.Items[0]).toHaveProperty('ManufacturerItemDescription');
    expect(jsonData.Items[0]).toHaveProperty('UnitQty');
    expect(jsonData.Items[0]).toHaveProperty('Quantity');
     expect(jsonData.Items[0]).toHaveProperty('UnitOfMeasure');
    expect(jsonData.Items[0]).toHaveProperty('bIsWeighted');
    expect(jsonData.Items[0]).toHaveProperty('QtyInPackage');
     expect(jsonData.Items[0]).toHaveProperty('ItemPrice');
    expect(jsonData.Items[0]).toHaveProperty('UnitOfMeasurePrice');
    expect(jsonData.Items[0]).toHaveProperty('AllowDiscount');
    expect(jsonData.Items[0]).toHaveProperty('ItemStatus');
  });
it('should handle missing XML file gracefully', async () => {
  const tempPath = path.join(path.dirname(outputPath), 'PriceFull-temp.xml');
    await fs.rename(outputPath, tempPath); 

    try {
      await parsePriceFull(outputPath);
    } 
    catch (error) {
      expect(error).toBeDefined();
    }
    finally {
    await fs.rename(tempPath, outputPath); // מחזיר את הקובץ המקורי
    }
  });

   afterAll(async() => {
    try {
      await fs.unlink(jsonPath);
    } catch (err) {
      console.error('Error deleting JSON file:', err);
    }
   });
  
  
});