import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';
import trpcTransformer from 'trpc-transformer';
import labels from './labels';
import sudokus from './sudokus';
import users from './users';
import walkthroughs from './walkthroughs';
import votes from './votes';
import comments from './comments';
import prisma from '$utils/prisma';
import { getJwt } from '$utils/jwt/getJwt';
import { DATABASE_URL } from '$env/static/private';

export const createContext = async (event: RequestEvent) => {
  console.log('DATABASE_URL', DATABASE_URL);
  const jwtToken = getJwt(event);
  return { event, prisma, token: jwtToken };
};

export type TRPCContext = inferAsyncReturnType<typeof createContext>;

export const router = trpc
  .router<TRPCContext>()
  .transformer(trpcTransformer)
  .merge('labels:', labels)
  .merge('users:', users)
  .merge('votes:', votes)
  .merge('walkthroughs:', walkthroughs)
  .merge('sudokus:', sudokus)
  .merge('comments:', comments);

export type Router = typeof router;
