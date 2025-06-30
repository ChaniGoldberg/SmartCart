import { User } from "@smartcart/shared/src/users";
import { Promotion } from "@smartcart/shared/src/promotions";
import { Store } from "@smartcart/shared/src/stores";
import { Price } from "@smartcart/shared/src/prices";
import { Item } from "@smartcart/shared";
import {Tag} from "@smartcart/shared/src/tags"

export interface IDB {
  User:User[],
  Promotion:Promotion[],
  Store:Store[],
  Price:Price[],
  Item: Item[];
  Tag: Tag[];
  Item_Tag:[]
}