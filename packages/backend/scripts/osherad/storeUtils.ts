

export function getLatestStoreFile(fileNames: string[]): string | null {
  fileNames.sort((a,b)=>{
    const timeA = a.match(/-(\d{12})\.xml$/)?.[1] ?? '';
    const timeB = b.match(/-(\d{12})\.xml$/)?.[1] ?? '';
    return timeB.localeCompare(timeA); 
  })
   return fileNames.length > 0 ? fileNames[0] : null;
}