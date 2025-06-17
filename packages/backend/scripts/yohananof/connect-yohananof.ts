import { Client } from "basic-ftp";

export async function testFTP(client: Client = new Client()) {
  try {
    await client.access({
      host: "url.publishedprices.co.il",
      user: "Yohananof",
      password: "",
      secure: false,
    });

    const fileList = await client.list();
    if (!Array.isArray(fileList) || fileList.length === 0) {
      throw new Error("No files found on the server.");
    }
  } catch (err) {
    throw new Error(typeof err === "string" ? err : (err instanceof Error ? err.message : JSON.stringify(err)));
  } finally {
    client.close();
  }
}