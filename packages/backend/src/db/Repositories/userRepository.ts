import { SupabaseClient } from "@supabase/supabase-js";
import { IUserRepository } from "../IRepositories/IUserRepository";
import { User } from "@smartcart/shared";

export class UserRepository implements IUserRepository {
    private readonly tableName = 'users';

    constructor(private supabase: SupabaseClient) {}

    // המרה ל-snake_case (עבור שליחה ל-DB)
    private toDbUser(user: Partial<User>) {
        return {
            email: user.email,
            password: user.password,
            user_name: user.userName,
            preferred_store: user.preferred_store || null
        };
    }

    // המרה מ-snake_case ל-camelCase (כאשר מקבלים מה-DB)
    private fromDbUser(dbUser: any): User {
        return {
            userId: dbUser.user_id,
            email: dbUser.email,
            password: dbUser.password,
            userName: dbUser.user_name,
            preferred_store: dbUser.preferred_store || undefined
        };
    }

    async addUser(user: Omit<User, 'userId'>): Promise<User> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert([this.toDbUser(user)])
                .select('*');

            if (error) {
                console.error('Error inserting user:', error);
                throw new Error(`Failed to insert user: ${error.message}`);
            }

            if (!data || data.length === 0) {
                throw new Error('No data returned after adding user.');
            }

            return this.fromDbUser(data[0]);
        } catch (error: any) {
            console.error(`Error in addUser: ${error.message}`);
            throw error;
        }
    }

    async addManyUsers(users: Omit<User, 'userId'>[]): Promise<User[]> {
        if (users.length === 0) {
            console.log('No users to add.');
            return [];
        }

        try {
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

            return data.map(dbUser => this.fromDbUser(dbUser));
        } catch (error: any) {
            console.error(`Error in addManyUsers: ${error.message}`);
            throw error;
        }
    }

    async updateUser(user: User): Promise<User> {
        try {
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

            return this.fromDbUser(data[0]);
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

                updatedUsers.push(this.fromDbUser(data[0]));
            }

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

            return data ? data.map(dbUser => this.fromDbUser(dbUser)) : [];
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
                if (error.code === 'PGRST116') {
                    return null;
                }
                console.error('Error fetching user by id:', error);
                throw new Error(`Failed to fetch user: ${error.message}`);
            }

            return data ? this.fromDbUser(data) : null;
        } catch (error: any) {
            console.error(`Error in getUserById: ${error.message}`);
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                console.error('Error fetching user by email:', error);
                throw new Error(`Failed to fetch user by email: ${error.message}`);
            }

            return data ? this.fromDbUser(data) : null;
        } catch (error: any) {
            console.error(`Error in getUserByEmail: ${error.message}`);
            throw error;
        }
    }

    async getUserByUsername(username: string): Promise<User | null> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('user_name', username)
                .single();
    
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                console.error('Error fetching user by username:', error);
                throw new Error(`Failed to fetch user by username: ${error.message}`);
            }
    
            return data ? this.fromDbUser(data) : null;
        } catch (error: any) {
            console.error(`Error in getUserByUsername: ${error.message}`);
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