import trpc from '$lib/client/trpc';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const trpcClient = trpc(fetch);
  const sudokuId = parseInt(params.id);
  const [sudoku, walkthrough] = await Promise.all([
    trpcClient.query('sudokus:get', { id: sudokuId }),
    trpcClient.query('walkthroughs:get', { sudokuId })
  ]);
  if (sudoku == null) {
    throw error(404, 'Not found');
  }
  return { sudoku, walkthrough };
};
