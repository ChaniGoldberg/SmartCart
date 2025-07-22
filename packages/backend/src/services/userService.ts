import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@smartcart/shared/src/user'
import { db } from '../db/dbProvider';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { UserRepository } from '../db/Repositories/userRepository';
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const supabase = createClient(
    process.env.SUPABASE_URL || "your-supabase-url",
    process.env.SUPABASE_ANON_KEY || "your-anon-key"
)

const repo = new UserRepository(supabase)
export function createUserTokenByJWT(user: User): string {
    return jwt.sign(user, SECRET_KEY);
}


export function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const users = await repo.getAllUsers();
    return users.find(user => user.email === email) || null;
}


export async function registerUser(
    userId: number, email: string, password: string, userName: string, preferred_store: string

): Promise<{ token: string; user: User }> {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
        userId,
        email,
        password: hashedPassword,
        userName,
        preferred_store
    };
    console.log(newUser)
    const saveduser = await repo.addUser(newUser);
    const token = createUserTokenByJWT(saveduser);
    return { token, user: newUser };

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
    userId: number,
    email: string,
    password: string,
    userName: string,
    preferred_store: string
): Promise<User> {
    const existingUser = await getUserByEmail(email);
    console.log(existingUser);

    if (!existingUser) {
        throw new Error('User not exists');
    }

    const hashedPassword = await hashPassword(password);
    const updatedUser: User = {
        userId,
        email,
        password: hashedPassword,
        userName,
        preferred_store
    };
    console.log(updatedUser);
    repo.updateUser(updatedUser);
    return updatedUser;
}

