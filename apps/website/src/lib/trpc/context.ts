import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import prisma from '$lib/prisma';
import { getJwt } from '$utils/jwt/getJwt';

export async function createContext(event: RequestEvent) {
  const jwtToken = getJwt(event);
  return { event, prisma, token: jwtToken };
}

export type Context = inferAsyncReturnType<typeof createContext>;
