import { User } from "@smartcart/shared/src/user";
import { Promotion } from "@smartcart/shared/src/promotion";
import { Store } from "@smartcart/shared/src/store";
import { Price } from "@smartcart/shared/src/price";
import { Item } from "@smartcart/shared/src/item";
import {Tag} from "@smartcart/shared/src/tag"

export interface IDB {
  User:User[],
  Promotion:Promotion[],
  Store:Store[],
  Price:Price[],
  Item: Item[];
  Tag: Tag[];
  Item_Tag:[];
  save(obj:any):void;
}