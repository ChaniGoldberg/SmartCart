import jwt from 'jsonwebtoken';
import { User } from '../../../shared/src/user'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export function createUserJWT(user: User): string {

    return jwt.sign(user, SECRET_KEY);
}
