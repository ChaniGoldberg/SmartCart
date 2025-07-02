import { getValidStores, geocodeAddress } from "../storeService";

//לצורך הבדיקה, מחליפה את הנתונים בנתונים מדומים.
jest.mock("../dependencyInjection/db", () => ({
  db: {
    Store: [
      {
        storeId: "1",
        chainId:"chain1",
        address: "דיזנגוף 10",
        city: "תל אביב",
      },
      {
        storeId: "2",
        chainId:"chain2",
        address: "",    //הכתובת ריקה לצורך בדיקת הפונקציה
        city: "חיפה",
      }
    ]
  }
}));

describe("getValidStores", () => {
  beforeEach(() => {
    jest.clearAllMocks();//מנקה את המוק הקודמים
    global.fetch = jest.fn(); //קיים fetch -לוודא שה 
  });

  // בדיקה האם הפונקציה מחזירה חנויות תקינות כולל קואורדינטה, כשהכתובת חוקית
  it("should return valid stores with coordinates", async () => {
    //דימוי של תגובת API
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        results: [
          {
            geometry: {
              lat: 32.08,
              lng: 34.78
            }
          }
        ]
      })
    });

    const result = await getValidStores();
//בודקת שהפונקציה מחזירה תוצאה תקינה שכוללת מערך עם חנות אחת 
    expect(result).toEqual([
      {
       storeId:"1",
        chainId: "chain1",
        fullAddress: "דיזנגוף 10, תל אביב",
        latitude: 32.08,
        longitude: 34.78
      }
    ]);
  });
  //בדיקה כשאין תוצאה מ-API
  it("should return null coordinates for invalid address", async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    json: async () => ({ results: [] }) // אין תוצאה מה-API
  });

  const result = await getValidStores();

  expect(result).toEqual([
    {
      storeId: "1",
      chainId: "chain1",
      fullAddress: "דיזנגוף 10, תל אביב",
      latitude: null, //מצופה שהפונקציה תחזיר בקוארדינטה null
      longitude: null
    }
  ]);
});
});
