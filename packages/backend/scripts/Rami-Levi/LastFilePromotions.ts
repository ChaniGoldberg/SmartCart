export async function ReturnsTheMostUpToDatePromotionsFile(allFiles: string[], storeId: string): Promise<string | null> {

  const filterPromo: string[] = allFiles.filter(x => x.startsWith('PromoFull'))
  filterPromo.sort((a, b) => b.localeCompare(a));

  for (let i = 0; i < filterPromo.length; i++) {
    const parts = filterPromo[i].split('-');
    const id = parts[1];
    if (id == storeId) {
      console.log(filterPromo[i], "!!!!")
      return filterPromo[i]
      break;
    }

  }

  return null
}