import { IItem } from "./interfaces/IItem";
import { ItemService } from "./services/itemService";
import { ITag } from "./interfaces/ITag";
import { TagService } from "./services/tagService";
import { tagRepository } from "./services/tagService";
export const itemService: IItem = new ItemService();
export const tagService: ITag = new TagService(tagRepository); // העבירי את tagRepository כארגומנט