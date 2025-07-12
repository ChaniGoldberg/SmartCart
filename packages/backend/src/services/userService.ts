import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@smartcart/shared/src/user'
import { db } from '../db/dbProvider';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';


export function createUserTokenByJWT(user: User): string {
    return jwt.sign(user, SECRET_KEY);
}


export function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return db.User.find(user => user.email === email) || null;
}

export async function registerUser(
    userId: number, email: string, password: string, userName: string

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
        userName
    };
    console.log(newUser)
    db.save(newUser)
    const token = createUserTokenByJWT(newUser);
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


