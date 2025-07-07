import { weight } from '@smartcart/shared/src/weight';

export function convertToKg(w: weight): weight {
  let valueInKg: number;

  switch (w.unit) {
    case 'גרם':
    case 'גרמים':
      valueInKg = w.value / 1000;
      break;
    case 'ק"ג':
    case 'קילוגרמים':
      valueInKg = w.value;
      break;
    default:
      throw new Error('יחידת משקל לא נתמכת');
  }

  return {
    value: valueInKg,
    unit: 'ק"ג'
  };
}
