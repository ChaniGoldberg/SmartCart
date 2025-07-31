// // // import fetch from "node-fetch";
// import { GOV_URLS } from '../../url'; 

// export async function getGovData() {
//   try {
//     const response = await fetch(GOV_URLS.natibHachesed, {
//       headers: {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117.0.0.0 Safari/537.36"
//       }
//     });
//     console.log("Status code from gov.il:", response.status);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.text();
//     return data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// }
