export type PriceFile = {
    fileName: string;
    timestamp: string;
    store: string;
    type: string;
};
export function getLatestPriceFilesPerStore(fileNames: string[]): string[] {
    const latestByStore: Record<string, PriceFile> = {};
    fileNames.forEach(fileName => {
        if (!fileName.startsWith('PriceFull')) return;
        const match = fileName.match(/^([A-Za-z]+)\d+-([0-9]{3})-([0-9]{12})$/);
        if (!match) return;
        const [, type, store, timestamp] = match;
        if (
            !latestByStore[store] ||
            timestamp > latestByStore[store].timestamp
        ) {
            latestByStore[store] = {
                fileName,
                timestamp,
                store,
                type
            };
        }
    });
    return Object.values(latestByStore).map(entry => entry.fileName);
}