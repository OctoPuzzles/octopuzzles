import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import trpcTransformer from 'trpc-transformer';

export const t = initTRPC.context<Context>().create({ transformer: trpcTransformer });
