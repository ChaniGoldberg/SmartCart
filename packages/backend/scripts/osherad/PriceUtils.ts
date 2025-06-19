export type PriceFile = {
    fileName: string;
    timestamp: string;
    store: string;
    type: string;
};
export function getLatestPriceFilesPerStore(fileNames: string[]): string[] {
    const latestByStore: Record<string, PriceFile> = {};
    fileNames.forEach(url => {
        // חילוץ שם הקובץ מתוך הקישור
        const fileName = url.substring(url.lastIndexOf('/') + 1);

        if (!fileName.startsWith('PriceFull')) return;
        // התאמה עם התבנית של שם הקובץ
        const match = fileName.match(/^([A-Za-z]+)\d+-([0-9]{3})-([0-9]{12})(?:\.gz)?$/);
        if (!match) return;

        const [, type, store, timestamp] = match;
        

        if (!latestByStore[store] || timestamp > latestByStore[store].timestamp) {
            latestByStore[store] = { fileName, timestamp, store, type };
        }
    });
    return Object.values(latestByStore).map(entry => entry.fileName);
    };