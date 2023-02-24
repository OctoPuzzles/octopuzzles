import trpc from '$lib/client/trpc';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  const trpcClient = trpc(fetch);
  const queryLabels = url.searchParams.getAll('label').map((l) => parseInt(l));
  const [labels, sudokuData] = await Promise.all([
    trpcClient.query('labels:getAll'),
    trpcClient.query('sudokus:search', { limit: 24, labels: queryLabels })
  ]);
  return { labels, sudokuData };
};
