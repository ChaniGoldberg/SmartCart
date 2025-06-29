import { User } from "@smartcart/shared/src/user";
import { Promotion } from "@smartcart/shared/src/promotions";
import { Store } from "@smartcart/shared/src/stores";
import { Price } from "@smartcart/shared/src/prices";
import { Item } from "@smartcart/shared";
import { Category } from "@smartcart/shared/src/categories";

export interface IDB {
  User:User[],
  Promotion:Promotion[],
  Store:Store[],
  Price:Price[],
  Item: Item[];
  Tag: Category[];
  Item_Tag:[]
}