import { convertToKg } from "../../src/interfaces/IWeight";
import { convertToLiter } from "../../src/interfaces/IVolume";

export default function quantityNormalization(item: any): any {
  const unit = item.unitQuantity;
  const value = item.unitOfMeasure;

  const weightUnits = ['גרם', 'ק"ג', 'גרמים', 'קילוגרמים'];
  const volumeUnits = ['מ"ל', 'ליטר', 'מיליליטר'];

  if (typeof value !== 'number') {
    console.warn(`ערך לא תקין ליחידה: ${value} עבור מוצר ${item.name}`);
    return item;
  }

  let normalized;

  try {
    if (weightUnits.includes(unit)) {
      normalized = convertToKg({ value, unit });
    } else if (volumeUnits.includes(unit)) {
      normalized = convertToLiter({ value, unit });
    } else {
      console.warn(`יחידה לא מוכרת: ${unit} עבור מוצר ${item.name}`);
      return item;
    }
  } catch (error) {
    console.error(`שגיאה בהמרת יחידה עבור מוצר ${item.name}:`, error);
    return item;
  }

  return {
    ...item,
    unitOfMeasure: normalized.value,
    unitQuantity: normalized.unit
  };
}
