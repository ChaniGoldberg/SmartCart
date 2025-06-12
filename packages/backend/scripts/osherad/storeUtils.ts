export function getLatestStoreFile(fileNames: string[]): string | null {
  let latestFile: string | null = null;
  let latestTimestamp: string | null = null;

  for (const fileName of fileNames) {
    const match = fileName.match(/^Stores\d+-?(\d{12})\.xml$/);
    if (!match) continue;

    const timestamp = match[1];
    if (!latestTimestamp || timestamp > latestTimestamp) {
      latestTimestamp = timestamp;
      latestFile = fileName;
    }
  }

  return latestFile;
}
