import { getGovData } from '../connect-nativ-hachesed';

(async () => {
    try {
        const data = await getGovData();
        console.log("✅ Success! First 500 chars:");

    }
    catch (error) {
        console.log("❌ Failed to fetch gov data:");
        console.error(error instanceof Error ? error.message : error);
    }
})();