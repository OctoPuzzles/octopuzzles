import { trpc } from '$lib/trpc/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const trpcClient = trpc(event);
  const queryLabels = event.url.searchParams.getAll('label').map((l) => parseInt(l));
  const [labels, sudokuData] = await Promise.all([
    trpcClient.labels.getAll.query(),
    trpcClient.sudokus.search.query({ limit: 24, labels: queryLabels })
  ]);
  return { labels, sudokuData };
};
