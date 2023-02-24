import trpc from '$lib/client/trpc';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const trpcClient = trpc(fetch);
  const userId = parseInt(params.id);
  const [sudokus, user, me] = await Promise.all([
    trpcClient.query('sudokus:search', { limit: 24, labels: [], userId: userId }),
    trpcClient.query('users:get', { id: userId }),
    trpcClient.query('users:me')
  ]);
  if (user == null) {
    throw error(404, 'Not found');
  }
  return { sudokus, user, me };
};
