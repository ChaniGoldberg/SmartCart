import { searchItemsByTag } from '../searchItemsByTag'; // Adjust the import path accordingly
import { itemService } from "../../../injection.config";
import { tagService } from "../../../injection.config";

jest.mock('../../../injection.config', () => ({
    itemService: {
        getAllItem: jest.fn(),
    },
    tagService: {
        getAllTags: jest.fn(),
    },
}));

describe('searchItemsByTag', () => {
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

        (tagService.getAllTags as jest.Mock).mockResolvedValue(mockTags);
        (itemService.getAllItem as jest.Mock).mockResolvedValue(mockItems);

        const result = await searchItemsByTag('Electro');

        expect(result).toEqual([
            { tagsId: [1], name: 'Laptop' },
            { tagsId: [1, 2], name: 'Tablet' },
        ]);
    });

    it('should return null if no items match the tag', async () => {
        const mockTags = [
            { tagId: 1, tagName: 'Electronics' },
        ];
        const mockItems = [
            { tagsId: [2], name: 'Novel' },
        ];

        (tagService.getAllTags as jest.Mock).mockResolvedValue(mockTags);
        (itemService.getAllItem as jest.Mock).mockResolvedValue(mockItems);


        const result = await searchItemsByTag('Books');

        expect(result).toEqual([]);
    });

    it('should return null if no tags are found', async () => {
        (tagService.getAllTags as jest.Mock).mockResolvedValue([]);
        (itemService.getAllItem as jest.Mock).mockResolvedValue([]);


        const result = await searchItemsByTag('AnyTag');

        expect(result).toEqual([]);
    });
});