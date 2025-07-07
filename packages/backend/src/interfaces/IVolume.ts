import { Volume } from '@smartcart/shared/src/volume';

export function convertToLiter(v: Volume): Volume {
  let valueInLiter: number;

  switch (v.unit) {
    case 'מ"ל':
    case 'מיליליטר':
      valueInLiter = v.value / 1000;
      break;
    case 'ליטר':
      valueInLiter = v.value;
      break;
    default:
      throw new Error('יחידת נפח לא נתמכת');
  }

  return {
    value: valueInLiter,
    unit: 'ליטר',
  };
}
