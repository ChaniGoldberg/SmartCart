
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@smartcart/shared/src/user';
import { createClient } from '@supabase/supabase-js';

import { UserRepository } from '../db/Repositories/userRepository';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.JWT_SECRET) {
    throw new Error('Missing environment variables: SUPABASE_URL, SUPABASE_ANON_KEY, or JWT_SECRET');
}

const SECRET_KEY = process.env.JWT_SECRET;
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
const repo = new UserRepository(supabase);

export function createUserTokenByJWT(user: User): string {
    return jwt.sign({ userId: user.userId, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
}

export function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return await repo.getUserByEmail(email);
}

export async function registerUser(
    email: string,
    password: string,
    userName: string,
    preferred_store: string
): Promise<{ token: string; user: User }> {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        console.log(`User with email ${email} already exists. Attempting to log in.`);
        return loginUser(email, password);
    }

    const hashedPassword = await hashPassword(password);

    const newUser: Omit<User, 'userId'> = {
        email,
        password: hashedPassword,
        userName,
        preferred_store
    };

    console.log("Attempting to add new user to DB:", newUser);
    const savedUser = await repo.addUser(newUser);

    console.log("User successfully added and returned from DB:", savedUser);
    const token = createUserTokenByJWT(savedUser);
    return { token, user: savedUser };
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error('Invalid password');
    }

    const token = createUserTokenByJWT(user);
    return { token, user };
}

export async function updateUser(
    userId: string,
    password: string,
    userName: string,
    preferred_store: string
): Promise<{ user: User; token: string }> {
    try {
        const existingUser = await repo.getUserById(userId);

        if (!existingUser) {
            throw new Error('User not found');
        }

        let updatedPassword = existingUser.password;
        if (password && password.trim() !== '') {
            updatedPassword = await hashPassword(password);
        }

        const updatedUser: User = {
            userId,
            email: existingUser.email,
            password: updatedPassword,
            userName: userName?.trim() ? userName : existingUser.userName,
            preferred_store: preferred_store?.trim() ? preferred_store : existingUser.preferred_store
        };

        console.log('Updating user with ID:', userId);
        const savedUser = await repo.updateUser(updatedUser);
        const token = createUserTokenByJWT(savedUser);
        return { user: savedUser, token };

    }
    catch (error: any) {
        console.error(`Error in userService.updateUser: ${error.message}`);
        throw error;
    }
}
