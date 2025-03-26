import jwt from 'jsonwebtoken'
import { serialize } from 'cookie';
import { JwtPayload } from './types';

// Generate JWT Token
export function generateJWT(jwtPayload: JwtPayload): string {
    const privateKey = process.env.JWT_SECRET as string

    const token = jwt.sign(jwtPayload, privateKey, {
        expiresIn: '30d'
    });

    return token;
}

// Set Cookie With JWT
export function setCookie(jwtPayload: JwtPayload): string {
    const token = generateJWT(jwtPayload)

    const cookie = serialize('jwtToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
    })

    return cookie;
}