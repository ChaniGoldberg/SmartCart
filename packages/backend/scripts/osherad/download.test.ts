import * as fs from 'fs';
import { PassThrough } from 'stream';
import downloadFile from '../osherad/downloadFile';
import fetch from 'node-fetch';

jest.mock('fs');
jest.mock('node-fetch', () => jest.fn());

const typedFetch = fetch as unknown as jest.Mock;

describe('downloadFile', () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should download and save a file', async () => {
    const fakeWriteStream = new PassThrough();
    mockedFs.createWriteStream.mockReturnValue(fakeWriteStream as any);

    const fakeResponseBody = new PassThrough();
    typedFetch.mockResolvedValue({
      ok: true,
      body: fakeResponseBody,
    });

    const promise = downloadFile('https://example.com/file.pdf', './downloads/test.pdf');

    fakeResponseBody.end(); // מסיים את הגוף המזויף
    fakeWriteStream.emit('finish'); // מפעיל את הארוע שסוגר את ההבטחה

    await expect(promise).resolves.toBeUndefined();

    expect(typedFetch).toHaveBeenCalledWith('https://example.com/file.pdf');
    expect(mockedFs.createWriteStream).toHaveBeenCalledWith('./downloads/test.pdf');
  });

  it('should throw if response not ok', async () => {
    typedFetch.mockResolvedValue({ ok: false });

    await expect(
      downloadFile('https://bad.url', './bad.pdf')
    ).rejects.toThrow('Network response was not ok');
  });

  it('should throw if response body is null', async () => {
    typedFetch.mockResolvedValue({ ok: true, body: null });

    await expect(
      downloadFile('https://no-body.com', './no.pdf')
    ).rejects.toThrow('Response body is null');
  });
});



