import { Client } from "basic-ftp";

export async function connectAndListFileNames(): Promise<string[]> {
    const client = new Client();
    client.ftp.verbose = true; // הדלקת verbose לבאגים

    try {
        console.log("📡 מנסה להתחבר ל-FTP...");
        await client.access({
            host: "url.publishedprices.co.il",
            user: "osherad",
            password: "",
            secure: false,
        });

        console.log("🔐 התחברות בוצעה בהצלחה.");

        const currentDir = await client.pwd();
        console.log("📂 תיקייה נוכחית:", currentDir);

        const files = await client.list();

        if (!files.length) {
            console.warn("⚠️ לא נמצאו קבצים בתיקייה.");
        } else {
            console.log(`📄 התקבלו ${files.length} קבצים מהשרת.`);
        }

        // הדפסת האובייקטים המלאים של הקבצים
        console.log("📦 פרטי הקבצים המלאים:");
        files.forEach((file, idx) => {
            console.log(`${idx + 1}.`, file);
        });

        const filteredFileNames = files.map(file => file.name);

        console.log(`🔢 סך הכל ${filteredFileNames.length} שמות קבצים לאחר סינון:`);

        filteredFileNames.forEach((name, idx) => {
            console.log(`${idx + 1}. ${name}`);
        });

        return filteredFileNames;

    } catch (err) {
        console.error("❌ שגיאה בגישה ל-FTP:", err);
        throw err;
    } finally {
        client.close();
        console.log("🔚 חיבור ל-FTP נסגר.");
    }
}

connectAndListFileNames();
