import { trpc } from '$lib/trpc/client';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const trpcClient = trpc(event);
  const userId = parseInt(event.params.id);
  const [sudokus, user, me] = await Promise.all([
    trpcClient.sudokus.search.query({ limit: 24, labels: [], userId: userId }),
    trpcClient.users.get.query({ id: userId }),
    trpcClient.users.me.query()
  ]);
  if (user == null) {
    throw error(404, 'Not found');
  }
  return { sudokus, user, me };
};
