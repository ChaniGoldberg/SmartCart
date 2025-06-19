export function lastUpdateStores(files: string[]): string | undefined {
    if (files.length === 0) {
        return undefined;
    }
    const updateFile = files.sort().reverse()[0];
    return updateFile.startsWith('StoresFull') ? updateFile : undefined;
}

