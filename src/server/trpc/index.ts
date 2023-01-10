import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';
import trpcTransformer from 'trpc-transformer';
import labels from './labels';
import sudokus from './sudokus';
import users from './users';
import userSettings from './userSettings';
import walkthroughs from './walkthroughs';
import savedGames from './savedGames';
import userStats from './userStats';
import votes from './votes';
import comments from './comments';
import prisma from '$lib/prisma';
import { getJwt } from '$utils/jwt/getJwt';

export const createContext = async (event: RequestEvent) => {
	const jwtToken = getJwt(event);
	return { event, prisma, token: jwtToken };
};

export type TRPCContext = inferAsyncReturnType<typeof createContext>;

export const router = trpc
	.router<TRPCContext>()
	.transformer(trpcTransformer)
	.merge('labels:', labels)
	.merge('users:', users)
	.merge('userSettings:', userSettings)
	.merge('votes:', votes)
	.merge('walkthroughs:', walkthroughs)
	.merge('savedGames:', savedGames)
	.merge('userStats:', userStats)
	.merge('sudokus:', sudokus)
	.merge('comments:', comments);

export type Router = typeof router;
