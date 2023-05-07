import { trpc } from '$lib/trpc/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const trpcClient = trpc(event);
  const [sudokus] = await Promise.all([trpcClient.sudokus.saved.query({ limit: 24 })]);
  return { sudokus };
};
