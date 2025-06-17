export function getMostUpdatedStroeFile(fileNames: string[]): string | null {
  const storeFiles = fileNames.filter(name =>
    name.startsWith("Stores") && /-(\d{12})\.xml$/.test(name)
  );

  storeFiles.sort((a, b) => {
    const timeA = a.match(/-(\d{12})\.xml$/)?.[1] ?? '';
    const timeB = b.match(/-(\d{12})\.xml$/)?.[1] ?? '';
    return timeB.localeCompare(timeA); 
  });

  return storeFiles.length > 0 ? storeFiles[0] : null;
}
