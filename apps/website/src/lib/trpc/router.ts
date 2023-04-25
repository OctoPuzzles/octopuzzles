import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { comments } from './routes/comments';
import { labels } from './routes/labels';
import { sudokus } from './routes/sudokus';
import { users } from './routes/users';
import { userSettings } from './routes/userSettings';
import { votes } from './routes/votes';
import { walkthroughs } from './routes/walkthroughs';
import { t } from './t';

export const router = t.router({
  comments,
  labels,
  sudokus,
  users,
  userSettings,
  votes,
  walkthroughs
});

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
