import jwt from 'jsonwebtoken';
import type { Role } from '@octopuzzles/models';
import type { RequestEvent } from '@sveltejs/kit';

export function getJwt(
  event: RequestEvent<Partial<Record<string, string>>>
): Pick<User, 'role' | 'id'> | null {
  const token = event.cookies.get('token');

  if (token == null) {
    return null;
  }

  const decodedToken = jwt.decode(token.replace('Bearer ', '')) as {
    id: number;
    role: Role;
  } | null;

  return decodedToken;
}
