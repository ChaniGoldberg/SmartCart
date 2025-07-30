import * as fs from "fs/promises";
import * as path from "path";
import * as zlib from "zlib";
import { createWriteStream } from "fs";
import AdmZip from "adm-zip";
import { Client } from "basic-ftp";

export async function downloadFileWithZip(client: Client, fileName: string, localDir: string): Promise<void> {
    const localPath = path.join(localDir, fileName);

    console.log(`⬇️ Downloading ${fileName} to ${localPath}...`);
    await client.downloadTo(localPath, fileName);
    console.log("✅ File downloaded.");

    const rawBuffer = await fs.readFile(localPath);
    console.log("📏 File size:", rawBuffer.length);
    console.log("🔎 File head preview:", rawBuffer.toString("utf8", 0, 100));

    const ext = path.extname(fileName);

    if (ext === ".zip") {
        const isZip = rawBuffer.slice(0, 4).equals(Buffer.from([0x50, 0x4B, 0x03, 0x04]));
        if (!isZip) {
            console.error("❌ Not a valid ZIP file. Skipping extract.");
            return;
        }

        try {
            const zip = new AdmZip(rawBuffer);
            const zipEntries = zip.getEntries();

            for (const entry of zipEntries) {
                if (!entry.isDirectory) {
                    const entryName = entry.entryName;
                    const targetPath = path.join(localDir, path.parse(entryName).name + ".xml");
                    await fs.writeFile(targetPath, entry.getData());
                    console.log(`✅ Extracted: ${targetPath}`);
                }
            }

            await fs.unlink(localPath); // מחיקה אחרי חילוץ
            console.log("✅ ZIP extracted and renamed with .xml.");
        } catch (err) {
            console.error("❌ Error extracting ZIP:", err);
        }
    } else if (ext === ".gz") {
        try {
            const decompressedBaseName = path.basename(fileName, ".gz");
            const decompressedPath = path.join(localDir, decompressedBaseName + ".xml");

            const input = await fs.readFile(localPath);
            const stream = zlib.createGunzip();
            const output = createWriteStream(decompressedPath);

            await new Promise<void>((resolve, reject) => {
                stream.on("error", reject);
                output.on("finish", resolve);
                stream.end(input);
                stream.pipe(output);
            });

            await fs.unlink(localPath); // מחיקה אחרי חילוץ
            console.log(`✅ GZIP extracted to ${decompressedPath}`);
        } catch (err) {
            console.error("❌ Error extracting GZIP:", err);
        }
    } else {
        // קובץ לא דחוס – מוסיף .xml רק אם אין כבר
        const extname = path.extname(localPath).toLowerCase();
        const alreadyHasXml = extname === ".xml";
    
        const renamedPath = alreadyHasXml ? localPath : localPath + ".xml";
    
        if (renamedPath !== localPath) {
            await fs.rename(localPath, renamedPath);
            console.log(`📄 Renamed file to: ${renamedPath}`);
        } else {
            console.log(`📄 File already ends with .xml: ${renamedPath}`);
        }
    }
}