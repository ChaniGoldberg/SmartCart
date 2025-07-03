import { convertToKg } from "../../src/interfaces/IWeight";
import { convertToLiter } from "../../src/interfaces/IVolume";

export default function quantityNormalization(item: any): void {
  
    const unit = item.unitQuantity;

    if (unit === 'גרם' || unit === 'ק"ג' || unit === 'גרמים' || unit === 'קילוגרמים') {
      convertToKg(item.unitOfMeasure);
    } else if (unit === 'מ"ל' || unit === 'ליטר' || unit === 'מיליליטר') {
      convertToLiter(item.unitOfMeasure);
    } else {
      console.warn(`יחידה לא מוכרת: ${unit} עבור מוצר ${item.name}`);
    }
  
}