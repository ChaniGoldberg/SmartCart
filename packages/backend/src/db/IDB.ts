import { User } from "@smartcart/shared";
import { Promotion } from "@smartcart/shared";
import { Store } from "@smartcart/shared";
import { Price } from "@smartcart/shared";
import { Item } from "@smartcart/shared";
import {Tag} from "@smartcart/shared"
import { Notification } from "@smartcart/shared";

export interface IDB {
  User:User[],
  Promotion:Promotion[],
  Store:Store[],
  Price:Price[],
  Item: Item[];
  Tag: Tag[];
  Item_Tag:[];
  save(obj:any):void;
  Notification: Notification[];
}