import { IDB } from "../IDB";

import userjson from "@smartcart/backend/mockData/users.json"
import promotionjson from "@smartcart/backend/mockData/promotions.json"
import storejson from "@smartcart/backend/mockData/stores.json"
import pricejson from "@smartcart/backend/mockData/items.json"
import tagjson from "@smartcart/backend/mockData/categories.json"

import { User } from "@smartcart/shared/src/user";
import { Promotion } from "@smartcart/shared/src/promotion";
import { Store } from "@smartcart/shared/src/store";
import { Price } from "@smartcart/shared/src/price";
import { Tag } from "@smartcart/shared/src/tag";

export const mockDb: IDB = {
    User:userjson as any as User [],
    Promotion: promotionjson as any as Promotion[],
    Store: storejson as any as Store[],
    Price: pricejson as any as Price[],
    Item_Tag: [],
    Item: [],
    Tag: tagjson as any as Tag[],
};