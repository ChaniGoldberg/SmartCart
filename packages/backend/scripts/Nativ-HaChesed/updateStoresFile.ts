export function lastUpdateStores(files: string[]): string | undefined {
    if (files.length === 0) {
        return undefined;
    }
    const storesFiles = files.filter(file => file.startsWith('StoresFull'));
    if (storesFiles.length === 0) {
        return undefined;
    }
    return storesFiles.sort().reverse()[0];
}