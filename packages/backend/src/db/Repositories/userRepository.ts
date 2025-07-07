import { SupabaseClient } from "@supabase/supabase-js";
import { IUserRepository } from "../IRepositories/IUserRepository";
import { User } from "../../../../shared/src/user";

export class UserRepository implements IUserRepository {
    private readonly tableName = 'users';

    constructor(private supabase: SupabaseClient) { }

    // המרה ל-snake_case
    private toDbUser(user: User) {
        return {
            user_id: user.userId,
            email: user.email,
            password: user.password,
            user_name: user.userName,
        };
    }

    async addUser(user: User): Promise<User> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert([this.toDbUser(user)])
                .select('*');

            if (error) {
                console.error('Error inserting user:', error);
                throw new Error(`Failed to add user: ${error.message}`);
            }

            if (!data || data.length === 0) {
                throw new Error('No data returned after adding user.');
            }

            console.log('user added successfully:', data[0]);
            return user;
        } catch (error: any) {
            console.error(`Error in addUser: ${error.message}`);
            throw error;
        }
    }

    async addManyUsers(users: User[]): Promise<User[]> {
        if (users.length === 0) {
            console.log('No users to add.');
            return [];
        }

        try {
            console.log(`Adding ${users.length} users to Supabase via bulk insert`);
            const dbUsers = users.map(user => this.toDbUser(user));
            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert(dbUsers)
                .select('*');

            if (error) {
                console.error('Error inserting multiple users:', error);
                throw new Error(`Failed to add multiple users: ${error.message}`);
            }

            if (!data) {
                throw new Error('No data returned after adding multiple users.');
            }

            console.log(`${data.length} users added successfully.`);
            return users;
        } catch (error: any) {
            console.error(`Error in addManyUsers: ${error.message}`);
            throw error;
        }
    }

    async updateUser(user: User): Promise<User> {
        try {
            console.log(`Updating user: ${user.email} (id: ${user.userId}) in Supabase`);
            const { data, error } = await this.supabase
                .from(this.tableName)
                .update(this.toDbUser(user))
                .eq('user_id', user.userId)
                .select('*');

            if (error) {
                console.error('Error updating user:', error);
                throw new Error(`Failed to update user: ${error.message}`);
            }

            if (!data || data.length === 0) {
                throw new Error('No data returned after updating user.');
            }

            console.log('User updated successfully:', data[0]);
            return user;
        } catch (error: any) {
            console.error(`Error in updateUser: ${error.message}`);
            throw error;
        }
    }

    async updateManyUsers(users: User[]): Promise<User[]> {
        if (users.length === 0) {
            console.log('No users to update.');
            return [];
        }

        try {
            console.log(`Updating ${users.length} users in Supabase`);
            const updatedUsers: User[] = [];
            for (const user of users) {
                const { data, error } = await this.supabase
                    .from(this.tableName)
                    .update(this.toDbUser(user))
                    .eq('user_id', user.userId)
                    .select('*');

                if (error) {
                    console.error(`Error updating user with id ${user.userId}:`, error);
                    throw new Error(`Failed to update user with id ${user.userId}: ${error.message}`);
                }

                if (!data || data.length === 0) {
                    throw new Error(`No data returned after updating user with id ${user.userId}.`);
                }

                updatedUsers.push(user);
            }
            console.log(`${updatedUsers.length} users updated successfully.`);
            return updatedUsers;
        } catch (error: any) {
            console.error(`Error in updateManyUsers: ${error.message}`);
            throw error;
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*');

            if (error) {
                console.error('Error fetching all users:', error);
                throw new Error(`Failed to fetch users: ${error.message}`);
            }

            return data || [];
        } catch (error: any) {
            console.error(`Error in getAllUsers: ${error.message}`);
            throw error;
        }
    }

    async getUserById(userId: string): Promise<User | null> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') { // Not found
                    return null;
                }
                console.error('Error fetching user by id:', error);
                throw new Error(`Failed to fetch user: ${error.message}`);
            }

            return data;
        } catch (error: any) {
            console.error(`Error in getUserById: ${error.message}`);
            throw error;
        }
    }

    async deleteUserById(userId: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from(this.tableName)
                .delete()
                .eq('user_id', userId);

            if (error) {
                console.error('Error deleting user:', error);
                throw new Error(`Failed to delete user: ${error.message}`);
            }
            console.log(`User with id ${userId} deleted successfully.`);
        } catch (error: any) {
            console.error(`Error in deleteUserById: ${error.message}`);
            throw error;
        }
    }
}