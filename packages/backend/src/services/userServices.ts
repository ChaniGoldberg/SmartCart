import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../../shared/src/user'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export function createUserTokenByJWT(user: User): string {
    return jwt.sign(user, SECRET_KEY);
}


export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

