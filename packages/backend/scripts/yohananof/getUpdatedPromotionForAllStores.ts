export async function getUpdatedPromotionForAllStores(allFiles: string[]): Promise<string[]> {
  const storeLastPromo: Map<string, string> = new Map();
  const latestFiles: string[] = [];

  const filterPromo: string[] = allFiles.filter(x => x.startsWith('PromoFull'));

  // מיון הקבצים בסדר יורד לפי שם הקובץ
  filterPromo.sort((a, b) => b.localeCompare(a));

  for (let i = 0; i < filterPromo.length; i++) {
    const filename = filterPromo[i];
    const parts = filename.split('-');

    // בדיקה שהפורמט תקין (PromoFull-StoreID-Date)
    if (parts.length === 3) {
      const storeId = parts[1];

      // אם זה הקובץ הראשון שאנחנו רואים לסניף הזה, נשמור אותו
      if (!storeLastPromo.has(storeId)) {
        storeLastPromo.set(storeId, filename);
      }
    }
  }

  // העתקת שמות הקבצים המעודכנים למערך
  storeLastPromo.forEach(filename => {
    latestFiles.push(filename);
  });

  return latestFiles;
}