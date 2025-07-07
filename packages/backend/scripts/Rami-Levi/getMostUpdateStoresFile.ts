function getMostUpdateStoresFile(fileNames: string[]): string | null {
let tempFiles: string[] = [];
  for (const file of fileNames) {
    if (file.startsWith("Stores") ){//בודק אם סוג קובץ המצאים אז אני מחזירה אותו
      tempFiles.push(file);
    }
  }
  
  
  tempFiles.sort((a, b) => b.localeCompare(a));//ממין בסדר יורד

  if (tempFiles.length == 0) {
    console.log("the arr is empty!!!!!!!!!!!!!!!!!!!!!!!!");
    
    return null;
  }
  return tempFiles[0];//לא מצא שום קובץ שעומד בתנאי
}
export default getMostUpdateStoresFile;
