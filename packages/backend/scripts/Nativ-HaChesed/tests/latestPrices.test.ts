
import { getLatestUpdatePriceFullFile } from "../latestPrices";

describe('getLatestUpdatePriceFullFile', () => {
  it('מחזיר את שם הקובץ עם התאריך המאוחר ביותר לסניף', () => {
    const files = [
      "PriceFull7290058160839-880-202406101025",
      "PriceFull7290058160839-880-202407151030",
      "PriceFull7290058160839-049-202408201015",
    ];
    const branch = "880";
    const result = getLatestUpdatePriceFullFile(files, branch);
    expect(result).toBe("PriceFull7290058160839-880-202407151030");
  });

  it('מחזיר null אם אין קובץ מתאים לסניף', () => {
    const files = [
      "PriceFull7290058160839-880-202406101025",
      "PriceFull7290058160839-049-202408201015",
    ];
    const branch = "999";
    const result = getLatestUpdatePriceFullFile(files, branch);
    expect(result).toBeNull();
  });

  it('מחזיר null אם אין קובץ עם תבנית תאריך תקינה', () => {
    const files = [
      "PriceFull7290058160839-880-INVALIDDATE",
      "PriceFull7290058160839-880-INVALID",
    ];
    const branch = "880";
    const result = getLatestUpdatePriceFullFile(files, branch);
    expect(result).toBeNull();
  });

  it('מחזיר null אם המערך ריק', () => {
    const files: string[] = [];
    const branch = "880";
    const result = getLatestUpdatePriceFullFile(files, branch);
    expect(result).toBeNull();
  });

  it('לא בוחר קבצים שלא מתחילים ב-PriceFull', () => {
    const files = [
      "OtherFull729002233-880-202406101025",
      "PriceFull7290058160839-880-202407151030",
    ];
    const branch = "880";
    const result = getLatestUpdatePriceFullFile(files, branch);
    expect(result).toBe("PriceFull7290058160839-880-202407151030");
  });

  it('מחזיר את הקובץ היחיד אם יש רק אחד מתאים', () => {
    const files = [
      "PriceFull7290058160839-880-202406101025",
      "OtherFull123456789-880-202407151030",
    ];
    const branch = "880";
    const result = getLatestUpdatePriceFullFile(files, branch);
    expect(result).toBe("PriceFull7290058160839-880-202406101025");
  });

  it('בודק מקרה של כמה קבצים עם אותו תאריך', () => {
    const files = [
      "PriceFull7290058160839-880-202406101025",
      "PriceFull7290058160839-880-202406101025",
    ];
    const branch = "880";
    const result = getLatestUpdatePriceFullFile(files, branch);
    // במקרה כזה, תחזיר את הראשון שמופיע
    expect(result).toBe("PriceFull7290058160839-880-202406101025");
  });

  it('בודק קובץ עם תאריך לא תקני באמצע', () => {
    const files = [
      "PriceFull7290058160839-880-202406101025",
      "PriceFull7290058160839-880-INVALID",
      "PriceFull7290058160839-880-202406111025",
    ];
    const branch = "880";
    const result = getLatestUpdatePriceFullFile(files, branch);
    expect(result).toBe("PriceFull7290058160839-880-202406111025");
  });
});

// import { getLatestUpdatePriceFullFile } from "../latestPrices";

// describe('getLatestUpdatePriceFullFile', () => {
//   it('מחזיר את שם הקובץ עם התאריך המאוחר ביותר לסניף', () => {
//     const files = [
//       "PriceFull7290058160839-880-202406101025",
//       "PriceFull7290058160839-880-202407151030",
//       "PriceFull7290058160839-049-202408201015",
//     ];
//     const branch = "880";
//     const result = getLatestUpdatePriceFullFile(files, branch);
//     expect(result).toBe("PriceFull7290058160839-880-202407151030");
//   });

//   it('מחזיר null אם אין קובץ מתאים לסניף', () => {
//     const files = [
//       "PriceFull7290058160839-880-202406101025",
//       "PriceFull7290058160839-049-202408201015",
//     ];
//     const branch = "999";
//     const result = getLatestUpdatePriceFullFile(files, branch);
//     expect(result).toBeNull();
//   });

//   it('מחזיר null אם אין קובץ עם תבנית תאריך תקינה', () => {
//     const files = [
//       "PriceFull7290058160839-880-INVALIDDATE",
//       "PriceFull7290058160839-880-INVALID",
//     ];
//     const branch = "880";
//     const result = getLatestUpdatePriceFullFile(files, branch);
//     expect(result).toBeNull();
//   });

//   it('מחזיר null אם המערך ריק', () => {
//     const files: string[] = [];
//     const branch = "880";
//     const result = getLatestUpdatePriceFullFile(files, branch);
//     expect(result).toBeNull();
//   });

//   it('לא בוחר קבצים שלא מתחילים ב-PriceFull', () => {
//     const files = [
//       "OtherFull729002233-880-202406101025",
//       "PriceFull7290058160839-880-202407151030",
//     ];
//     const branch = "880";
//     const result = getLatestUpdatePriceFullFile(files, branch);
//     expect(result).toBe("PriceFull7290058160839-880-202407151030");
//   });

//   it('מחזיר את הקובץ היחיד אם יש רק אחד מתאים', () => {
//     const files = [
//       "PriceFull7290058160839-880-202406101025",
//       "OtherFull123456789-880-202407151030",
//     ];
//     const branch = "880";
//     const result = getLatestUpdatePriceFullFile(files, branch);
//     expect(result).toBe("PriceFull7290058160839-880-202406101025");
//   });

//   it('בודק מקרה של כמה קבצים עם אותו תאריך', () => {
//     const files = [
//       "PriceFull7290058160839-880-202406101025",
//       "PriceFull7290058160839-880-202406101025",
//     ];
//     const branch = "880";
//     const result = getLatestUpdatePriceFullFile(files, branch);
//     expect(result).toBe("PriceFull7290058160839-880-202406101025");
//   });

//   it('בודק קובץ עם תאריך לא תקני באמצע', () => {
//     const files = [
//       "PriceFull7290058160839-880-202406101025",
//       "PriceFull7290058160839-880-INVALID",
//       "PriceFull7290058160839-880-202406111025",
//     ];
//     const branch = "880";
//     const result = getLatestUpdatePriceFullFile(files, branch);
//     expect(result).toBe("PriceFull7290058160839-880-202406111025");
//   });
// });