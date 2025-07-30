import { User } from "@smartcart/shared";

export interface IUserRepository {
  addUser(user: User): Promise<User>;
  addManyUsers(users: User[]): Promise<User[]>;
  updateUser(user: User): Promise<User>;
  updateManyUsers(users: User[]): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<User | null>;
  deleteUserById(userId: string): Promise<void>;
}