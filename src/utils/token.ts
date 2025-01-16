import { sign, verify } from 'hono/jwt';
import { SECRET } from '@/config';

import { JwtTokenExpired } from 'hono/utils/jwt/types';

export const createToken = async (userId: string, expireInDays: number = 7) => {
  try {
    const exp = Math.floor(Date.now() / 1000) + expireInDays * 24 * 60 * 60;

    const jwt = await sign({ userId, exp }, SECRET.TOKEN_SECRET);

    return jwt;
  } catch (err) {
    console.error('Error creating token:', err);
    return null;
  }
};

export const validateToken = async (token: string) => {
  try {
    const payload = await verify(token, SECRET.TOKEN_SECRET);

    if (payload instanceof JwtTokenExpired) {
      console.error('Token expired');
    }

    return payload;
  } catch (err) {
    console.error('Error validating token:', err);
    return null;
  }
};
