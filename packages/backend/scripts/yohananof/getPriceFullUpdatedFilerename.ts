export async function getUpdatedPriceFullByStoreId(allFiles: string[], storeId: string): Promise<string> {
    const filterPromo: string[] = allFiles.filter(x => x.startsWith('PriceFull'))
    const matchingFiles: string[] = []
    for (let i = 0; i < filterPromo.length; i++) {
        
        const filename = filterPromo[i]
      
        const parts = filename.split('-');
        
        const id=parts[1];
        if(id==storeId)
       { matchingFiles.push(filename)}
    }
    matchingFiles.sort()

    return matchingFiles[matchingFiles.length - 1]  
}
