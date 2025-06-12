// }


export async function lastFileForStoreId(allFiles: string[], storeId: string): Promise<string> {
    const filterPromo: string[] = allFiles.filter(x => x.startsWith('PriceFull'))
    const dates: string[] = []//מערך מסונן של תאריכים של הסניף הבודד
    for (let i = 0; i < filterPromo.length; i++) {
        
        const filename = filterPromo[i]
      
        const parts = filename.split('-');
        //התאריך נמצא בחלק השלישי
        const dateWithExt = parts[2];
        const data = dateWithExt.split('.')[0];
        const id=parts[1];
        if(id==storeId)
       { dates.push(data)}
    }
    dates.sort()

    return dates[dates.length - 1]  // מחזיר את התאריך האחרון או null אם אין תאריכים
}
