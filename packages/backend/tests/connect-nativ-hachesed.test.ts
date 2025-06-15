import { getGovData } from '../scripts/connect-nativ-hachesed';

(async () => {
    try {
        const data = await getGovData();
        console.log("✅ Success! First 500 chars:");
        console.log(data.slice(0, 500)); // מדפיס רק חלק, כדי לא להציף את הטרמינל

    }
    catch (error) {
        console.log("❌ Failed to fetch gov data:");
        console.error(error instanceof Error ? error.message : error);
    }
})();