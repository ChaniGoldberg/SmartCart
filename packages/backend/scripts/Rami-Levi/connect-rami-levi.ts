import { Client, FileInfo } from "basic-ftp";

export async function connectAndListFiles(): Promise<{ client: Client; files: FileInfo[] }> {
    const client = new Client();
    client.ftp.verbose = true;
    
    try {
        await client.access({
            host: "url.publishedprices.co.il",
            user: "RamiLevi",
            password: "",
            secure: false,
        });

        const files = await client.list();
        return { client, files };
    } catch (err) {
        
        throw err;
    }
    
}




