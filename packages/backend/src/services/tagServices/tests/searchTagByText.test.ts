import { searchTagsByText } from '../searchTagByText';
import { TagRepository } from "../../../db/Repositories/tagRepository";
import { supabase } from "../../supabase";

jest.mock("../../../db/Repositories/tagRepository");
jest.mock("../../supabase", () => ({
    __esModule: true,
    supabase: {},
}));

describe('searchTagsByText', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return matching tags from fuzzySearchTagsByName', async () => {
        const mockTags = [
            { tagId: 1, tagName: 'Electronics' },
            { tagId: 2, tagName: 'Books' },
        ];
        // Mock the TagRepository instance method
        (TagRepository as jest.Mock).mockImplementation(() => ({
            fuzzySearchTagsByName: jest.fn().mockResolvedValue(mockTags),
        }));

        const result = await searchTagsByText('Electro');
        expect(result).toEqual(mockTags);
    });

    it('should return null if tagName is empty', async () => {
        const result = await searchTagsByText('');
        expect(result).toBeNull();
    });

    it('should return null if tagName is not a string', async () => {
        // @ts-expect-error
        const result = await searchTagsByText(null);
        expect(result).toBeNull();
    });

    it('should return null if fuzzySearchTagsByName returns null', async () => {
        (TagRepository as jest.Mock).mockImplementation(() => ({
            fuzzySearchTagsByName: jest.fn().mockResolvedValue(null),
        }));

        const result = await searchTagsByText('AnyTag');
        expect(result).toBeNull();
    });
});