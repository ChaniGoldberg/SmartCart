import "dotenv/config";
import SearchService from "../searchProductService"; // עדכני נתיב אם צריך

(async () => {
 
})();
export default async function testSearchService() {
    const searchService = new SearchService();

    try {
      // const searchText = "גבינה"; // טקסט חיפוש לדוגמא
      // const results = await searchService.getItemsWithPrices(searchText);
  
      // console.log(`Found ${results.length} items with prices for search text '${searchText}':`);
      // results.slice(0, 5).forEach(({ item, price }, index) => {
      //   console.log(`#${index + 1}: ${item.itemName} - Price: ${price?.price || "No price"}`);
      // });
    } catch (error) {
      console.error("Error in search service test:", error);
    }
}