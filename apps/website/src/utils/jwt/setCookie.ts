import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

import pick from 'lodash/pick';
import type { RequestEvent } from '@sveltejs/kit';
import type { User } from '@prisma/client';

export function setCookie(
  user: User,
  ctx: {
    event: RequestEvent<Partial<Record<string, string>>>;
  }
): void {
  const token = jwt.sign(pick(user, ['id', 'role']), JWT_SECRET, {
    expiresIn: `${15 * 60 * 1000}`
  });
  ctx.event.cookies.set('token', `Bearer ${token}`, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24
  });
}
