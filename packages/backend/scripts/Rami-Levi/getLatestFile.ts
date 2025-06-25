function getLatestFile(fileNames: string[]): string | null {
  fileNames.sort((a, b) => b.localeCompare(a));//ממין בסדר יורד
  for (const file of fileNames) {
    if ((file.substring(0, 6)) === "Stores") {//בודק אם סוג קובץ המצאים אז אני מחזירה אותו
      return file;
    }
  }
  return null;//לא מצא שום קובץ שעומד בתנאי
}
export default getLatestFile;
