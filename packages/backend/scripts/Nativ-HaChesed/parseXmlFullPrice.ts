import { parseStringPromise } from 'xml2js';

// טיפוס לפריט לאחר סינון
export interface FilteredItem {
  ItemCode: string;
  UnitQty: string;
  Quantity: string;
  bIsWeighted: string;
  ItemPrice: string;
  UnitOfMeasurePrice: string;
}

// פונקציה שממירה XML למערך של FilteredItem
export async function parseXML(xmlData: string): Promise<FilteredItem[]> {
  try {
    const result = await parseStringPromise(xmlData, { explicitArray: false, mergeAttrs: true });

    const itemsRaw = result?.Root?.Items?.Item;
    if (!itemsRaw) return [];

    const items = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];

    const filteredItems: FilteredItem[] = items
      .filter((item: any) =>
        item.ItemCode &&
        item.UnitQty &&
        item.Quantity &&
        item.bIsWeighted &&
        item.ItemPrice &&
        item.UnitOfMeasurePrice
      )
      .map((item: any) => ({
        ItemCode: item.ItemCode,
        UnitQty: item.UnitQty,
        Quantity: item.Quantity,
        bIsWeighted: item.bIsWeighted,
        ItemPrice: item.ItemPrice,
        UnitOfMeasurePrice: item.UnitOfMeasurePrice
      }));

    return filteredItems;
  } catch (error) {
    throw new Error(`שגיאה בניתוח XML: ${(error as Error).message}`);
  }
}
