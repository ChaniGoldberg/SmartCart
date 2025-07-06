import { searchTagsByText } from '../searchTagByText'; // Adjust the import path accordingly
import { tagService } from "../../../injection.config";

jest.mock('../../../injection.config', () => ({
    tagService: {
        getAllTags: jest.fn(),
    },
}));

describe('searchTagsByText', () => {
    it('should return matching tags based on tag name', async () => {
        const mockTags = [
            { tagId: 1, tagName: 'Electronics' },
            { tagId: 2, tagName: 'Books' },
        ];

        (tagService.getAllTags as jest.Mock).mockResolvedValue(mockTags);

        const result = await searchTagsByText('Electro');

        expect(result).toEqual([{ tagId: 1, tagName: 'Electronics' }]);
    });

    it('should return null if no tags match the search text', async () => {
        const mockTags = [
            { tagId: 1, tagName: 'Electronics' },
        ];

        (tagService.getAllTags as jest.Mock).mockResolvedValue(mockTags);

        const result = await searchTagsByText('Toys');

        expect(result).toBeNull();
    });

    it('should return null if no tags are found', async () => {
        (tagService.getAllTags as jest.Mock).mockResolvedValue([]);

        const result = await searchTagsByText('AnyTag');

        expect(result).toBeNull();
    });

    it('should return null if tags are not an array', async () => {
        (tagService.getAllTags as jest.Mock).mockResolvedValue(null);

        const result = await searchTagsByText('AnyTag');

        expect(result).toBeNull();
    });
});