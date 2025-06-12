// export async function ReturnsTheMostUpToDatePromotionsFile(allFiles: string[], storeId: string): Promise<string[]> {
//     const filterPromo: string[] = allFiles.filter(x => x.startsWith('PromoFull'))
//     const dates: string[] = []//מערך מסונן של תאריכים של הסניף הבודד
//     for (let i = 0; i < filterPromo.length; i++) {
//         const filename = filterPromo[i]
//         const parts = filename.split('-');
//         if (parts[1] === storeId && parts.length === 3) {
//             const dateWithExt = parts[2];
//             const data = dateWithExt.split('.')[0];
//             if (data.length === 8) {
//                 dates.push(data);
//             }
//         }
//     }
//     dates.sort()
//     return dates
// }



export async function ReturnsTheMostUpToDatePromotionsFile(allFiles: string[], storeId: string): Promise<string | null> {
  const filterPromo: string[] = allFiles.filter(x => x.startsWith('PromoFull'))
  const dates: string[] = []//מערך מסונן של תאריכים של הסניף הבודד
  for (let i = 0; i < filterPromo.length; i++) {
    const filename = filterPromo[i]
    const parts = filename.split('-');
    //התאריך נמצא בחלק השלישי
    const dateWithExt = parts[2];
    const data = dateWithExt.split('.')[0];

    const id = parts[1]

    if (id === storeId) {
      dates.push(data);
    }

  }
  dates.sort()
  return dates[dates.length-1]
}





























