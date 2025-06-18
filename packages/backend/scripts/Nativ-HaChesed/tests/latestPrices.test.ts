import { getLatestDate } from '../latestPrices';
describe('getLatestDate', () => {
  it('מחזיר את המחרוזת עם התאריך המאוחר ביותר לסניף', () => {
    const strings = ["PriceFull729002233-880-202506101025",
      "PriceFull123456789-880-202507151030",
      "PriceFull987654321-049-202508201015",];
    const branch = "880";
    const result = getLatestDate(strings, branch);
    expect(result).toBe("PriceFull123456789-880-202507151030");
  });



  it('מחזיר null אם אין אף מחרוזת מתאימה לסניף', () => {
    const strings = [
      "PriceFull729002233-880-202506101025",
      "PriceFull987654321-049-202508201015",
    ];
    const branch = "999";
    const result = getLatestDate(strings, branch);
    expect(result).toBeNull();
  });

  it('מחזיר null אם אין אף מחרוזת עם תבנית תאריך תקינה', () => {
    const strings = [
      "PriceFull729002233-880-INVALIDDATE",
      "PriceFull123456789-880-INVALID",
    ];
    const branch = "880";
    const result = getLatestDate(strings, branch);
    expect(result).toBeNull();
  });

  it('מחזיר null אם המערך ריק', () => {
    const strings: string[] = [];
    const branch = "880";
    const result = getLatestDate(strings, branch);
    expect(result).toBeNull();
  });

  it('לא בוחר מחרוזות שלא מתחילות ב-PriceFull', () => {
    const strings = [
      "OtherFull729002233-880-202506101025",
      "PriceFull123456789-880-202507151030",
    ];
    const branch = "880";
    const result = getLatestDate(strings, branch);
    expect(result).toBe("PriceFull123456789-880-202507151030");
  });

  it('מחזיר את המחרוזת היחידה אם יש רק אחת מתאימה', () => {
    const strings = [
      "PriceFull729002233-880-202506101025",
      "OtherFull123456789-880-202507151030",
    ];
    const branch = "880";
    const result = getLatestDate(strings, branch);
    expect(result).toBe("PriceFull729002233-880-202506101025");
  });

  it('בודק מקרה של כמה מחרוזות עם אותו תאריך', () => {
    const strings = [
      "PriceFull111111111-880-202506101025",
      "PriceFull222222222-880-202506101025",
    ];
    const branch = "880";
    const result = getLatestDate(strings, branch);
    // במקרה כזה, תחזיר את הראשונה שמופיעה
    expect(result).toBe("PriceFull111111111-880-202506101025");
  });
});