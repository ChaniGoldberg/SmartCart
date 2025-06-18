function getMostUpdate(fileNames: string[], branch: string): string | null {
  const fileNameRegex = /-(\d{3})-/;
  fileNames.sort((a, b) => b.localeCompare(a));//ממין בסדר יורד
  for (const file of fileNames) {
    const match = file.match(fileNameRegex);//מוצא את שם הסניף
    if (match) {
      const fileBranchCode = match[1]; // לדוגמה:001
      if (fileBranchCode === branch && (file.substring(0, 9)) === "PriceFull") {//בודק אם המספר הסניף הוא תואם וגם זה סוג קובץ המצאים אז אני מחזירה אותו
        return file;
      }
    }
  }
  return null;//לא מצא שום קובץ שעומד בתנאי
}
export default getMostUpdate;