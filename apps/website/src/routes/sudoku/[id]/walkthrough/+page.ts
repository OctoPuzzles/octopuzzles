import { trpc } from '$lib/trpc/client';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const trpcClient = trpc(event);
  const sudokuId = parseInt(event.params.id);
  const [sudoku, walkthrough] = await Promise.all([
    trpcClient.sudokus.get.query({ id: sudokuId }),
    trpcClient.walkthroughs.get.query({ sudokuId })
  ]);
  if (sudoku == null) {
    throw error(404, 'Not found');
  }
  return { sudoku, walkthrough };
};
