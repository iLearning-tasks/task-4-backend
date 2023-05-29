import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const generateToken = (id: number): string => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY!);
    return token;
};
const verifyToken = (token: string): any => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export { generateToken, verifyToken };
