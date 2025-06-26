function getMostUpdateStoresFile(fileNames: string[]): string | null {
  let tempFiles = []
  for (const file of fileNames) {
    if ((file.substring(0, 6)) === "Stores") {//בודק אם סוג קובץ המצאים אז אני מחזירה אותו
      tempFiles.push(file);
    }
  }
  tempFiles.sort((a, b) => b.localeCompare(a));//ממין בסדר יורד

  if (tempFiles = []) {
    return null;
  }
  return tempFiles[0];//לא מצא שום קובץ שעומד בתנאי
}
export default getMostUpdateStoresFile;
