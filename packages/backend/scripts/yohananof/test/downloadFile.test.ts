import fetch from 'node-fetch';
import * as fs from "fs";
import { downloadFile } from "../downloadFile";
jest.mock("fs");
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));
describe("downloadFile", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

   
    it("should throw error for invalid output path", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            body: { 
                pipe: () => {}, 
                on: (event: string, cb: Function) => { if (event === 'error') cb(); }
            }
        });

        (fs.createWriteStream as jest.Mock).mockImplementation(() => {
            throw new Error("ENOENT: no such file or directory, open ''");
        });

        await expect(downloadFile("https://example.com/file.pdf", "")).rejects.toThrow("no such file or directory");
    });
     it("should throw error for invalid file path", async () => {
        (fetch as jest.Mock).mockImplementation(() => {
            throw new Error("Only absolute URLs are supported");
        });

        await expect(downloadFile("", "output.json")).rejects.toThrow("Only absolute URLs are supported");
    });


    it("should throw error if cannot write to output path", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            body: { 
                pipe: () => {}, 
                on: (event: string, cb: Function) => { if (event === 'error') cb(); }
            }
        });

        (fs.createWriteStream as jest.Mock).mockImplementation(() => {
            throw new Error("EACCES: permission denied");
        });

        await expect(
            downloadFile("https://example.com/file.pdf", "protected/output.pdf")
        ).rejects.toThrow("EACCES: permission denied");
    });
     it("should throw error if response body is null", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            body: null
        });

        await expect(
            downloadFile("https://example.com/file.pdf", "output.pdf")
        ).rejects.toThrow("Response body is null");
    });

    it("should throw error if network response is not ok", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 404,
            statusText: "Not Found",
            body: {}
        });

        await expect(
            downloadFile("https://example.com/file.pdf", "output.pdf")
        ).rejects.toThrow("Network response was not ok");
    });

   

    it("should download and save file successfully", async () => {
        const fileContent = "hello world";
        const { Readable } = require('stream');
        const mockStream = new Readable();
        mockStream.push(fileContent);
        mockStream.push(null);

        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            body: mockStream
        });

        const writeStream = {
            on: jest.fn((event, cb) => { if (event === 'finish') cb(); }),
            once: jest.fn(),
            emit: jest.fn(),
            end: jest.fn(),
            write: jest.fn(),
        };

        (fs.createWriteStream as jest.Mock).mockReturnValue(writeStream);

        await expect(downloadFile("https://example.com/file.txt", "output.txt")).resolves.toBeUndefined();
        expect(fs.createWriteStream).toHaveBeenCalledWith("output.txt");
    });
});