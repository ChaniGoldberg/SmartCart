import { testFTP } from '../connect-yohananof';
import { Client, FileType } from 'basic-ftp';

describe('testFTP', () => {
  it('should throw an error if no files found', async () => {
    const mockClient = {
      access: jest.fn().mockResolvedValue({ code: 200, message: 'OK' }),
      list: jest.fn().mockResolvedValue([]),
      close: jest.fn(),
    } as unknown as Client;

    await expect(testFTP(mockClient)).rejects.toThrow('No files found on the server.');
  });

  it('should succeed if files are found', async () => {
    const mockClient = {
      access: jest.fn().mockResolvedValue({ code: 200, message: 'OK' }),
      list: jest.fn().mockResolvedValue([{
        name: 'file1.txt',
        type: FileType.Unknown,
        size: 0,
        rawModifiedAt: '',
        isDirectory: false,
        isSymbolicLink: false,
        isFile: false,
        date: ''
      }]),
      close: jest.fn(),
    } as unknown as Client;

    await expect(testFTP(mockClient)).resolves.not.toThrow();
  });

  it('should throw if access fails', async () => {
    const mockClient = {
      access: jest.fn().mockRejectedValue(new Error('Access denied')),
      list: jest.fn(),
      close: jest.fn(),
    } as unknown as Client;

    await expect(testFTP(mockClient)).rejects.toThrow('Access denied');
  });
});