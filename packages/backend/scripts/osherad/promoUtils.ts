export type PromoFile = {
    fileName: string;
    timestamp: string;
    store: string;
    type: string;
};

export function getLatestPromoFilesPerStore(fileNames: string[]): string[] {
    const latestByStore: Record<string, PromoFile> = {};
  
    fileNames.forEach(fileName => {
      if (!fileName.startsWith('PromoFull')) return;
      const match = fileName.match(/^([A-Za-z]+)(\d+)-(\d{3})-(\d{12})(?:\.gz)?$/);
      if (!match) return;
  
      const [, type, chainId, store, timestamp] = match;
  
      if (!latestByStore[store] || timestamp > latestByStore[store].timestamp) {
        latestByStore[store] = { fileName, timestamp, store, type };
      }
    });
  
    return Object.values(latestByStore).map(entry => entry.fileName);
  }