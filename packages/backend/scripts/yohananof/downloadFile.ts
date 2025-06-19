import * as fs from 'fs';
import fetch from 'node-fetch';


export async function downloadFile(fileUrl: string, outputPath: string) {
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    if (!response.body) {
        throw new Error('Response body is null');
    }

    const fileStream = fs.createWriteStream(outputPath);
    return new Promise<void>((resolve, reject) => {
        response.body!.pipe(fileStream);
        response.body!.on('error', reject);
        fileStream.on('finish', resolve);
    });
}
