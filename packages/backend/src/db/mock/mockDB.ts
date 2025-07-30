import { IDB } from "../IDB";

import userjson from "@smartcart/backend/mockData/users.json"
import promotionjson from "@smartcart/backend/mockData/promotions.json"
import storejson from "@smartcart/backend/mockData/stores.json"
import itemjson from "@smartcart/backend/mockData/items.json"
import pricejson from "@smartcart/backend/mockData/prices.json"
import tagjson from "@smartcart/backend/mockData/tags.json"


import { User } from "@smartcart/shared";
import { Promotion } from "@smartcart/shared";
import { Store } from "@smartcart/shared";
import { Price } from "@smartcart/shared";
import { Tag } from "@smartcart/shared";
import { Item } from "@smartcart/shared";
export const mockDb: IDB = {
    User:userjson as any as User [],
    Promotion: promotionjson as any as Promotion[],
    Store: storejson as any as Store[],
    Price: pricejson as any as Price[],
    Item_Tag: [],
    Item: itemjson as any as Item[],
    Tag: tagjson as any as Tag[],
    Notification: [],
    save(obj:any):void {
        console.log(obj)
    }
};