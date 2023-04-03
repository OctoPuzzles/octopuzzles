import { trpc } from '$lib/trpc/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const sudokuIdParam = event.url.searchParams.get('id');
  const sudokuId = sudokuIdParam ? parseInt(sudokuIdParam) : undefined;
  const trpcClient = trpc(event);
  const [sudoku, walkthrough] =
    sudokuId != null
      ? await Promise.all([
          trpcClient.sudokus.get.query({ id: sudokuId }),
          trpcClient.walkthroughs.get.query({ sudokuId })
        ])
      : [null, null];
  const labels = await trpcClient.labels.getAll.query();
  return { sudoku, labels, walkthrough };
};
