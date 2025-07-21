import { searchItemsByTag } from '../searchItemsByTag';
import { itemService } from "../../../injection.config";
import { searchTagsByText } from "../searchTagByText";

jest.mock('../../../injection.config', () => ({
    itemService: {
        getAllItem: jest.fn(),
    },
}));

jest.mock('../searchTagByText', () => ({
    searchTagsByText: jest.fn(),
}));

describe('searchItemsByTag', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return filtered items based on tag name', async () => {
        const mockTags = [
            { tagId: 1, tagName: 'Electronics' },
            { tagId: 2, tagName: 'Books' },
        ];
        const mockItems = [
            { tagsId: [1], name: 'Laptop' },
            { tagsId: [2], name: 'Novel' },
            { tagsId: [1, 2], name: 'Tablet' },
        ];

        (searchTagsByText as jest.Mock).mockResolvedValue(mockTags);
        (itemService.getAllItem as jest.Mock).mockResolvedValue(mockItems);

        const result = await searchItemsByTag('Electro');

        expect(result).toEqual([
            { tagsId: [1], name: 'Laptop' },
            { tagsId: [2], name: 'Novel' },
            { tagsId: [1, 2], name: 'Tablet' },
        ]);
    });

    it('should return an empty array if no items match the tag', async () => {
        const mockTags = [
            { tagId: 1, tagName: 'Electronics' },
        ];
        const mockItems = [
            { tagsId: [2], name: 'Novel' },
        ];

        (searchTagsByText as jest.Mock).mockResolvedValue(mockTags);
        (itemService.getAllItem as jest.Mock).mockResolvedValue(mockItems);

        const result = await searchItemsByTag('Books');

        expect(result).toEqual([]);
    });

    it('should return null if no tags are found', async () => {
        (searchTagsByText as jest.Mock).mockResolvedValue(null);
        (itemService.getAllItem as jest.Mock).mockResolvedValue([]);

        const result = await searchItemsByTag('AnyTag');

        expect(result).toBeNull();
    });
});