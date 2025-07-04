import { IItem } from "./interfaces/IItem";
import { ItemService } from "./services/itemService"; // המוק
import { ITag } from "./interfaces/ITag";
import { TagService } from "./services/tagService"; // המוק
export const itemService: IItem = new ItemService();
export const tagService: ITag = new TagService();