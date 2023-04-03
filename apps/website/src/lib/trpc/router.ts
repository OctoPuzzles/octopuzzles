import type { Context } from '$lib/trpc/context';
import { comments } from './routes/comments';
import { labels } from './routes/labels';
import { sudokus } from './routes/sudokus';
import { users } from './routes/users';
import { votes } from './routes/votes';
import { walkthroughs } from './routes/walkthroughs';
import { initTRPC, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  comments,
  labels,
  sudokus,
  users,
  votes,
  walkthroughs
});

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
