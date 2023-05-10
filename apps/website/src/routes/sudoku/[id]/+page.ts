import { trpc } from '$lib/trpc/client';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { decompressFromBase64 } from '@octopuzzles/utils';
import type { GameData } from '@octopuzzles/models';

export const load: PageLoad = async (event) => {
  const trpcClient = trpc(event);
  const sudokuId = parseInt(event.params.id);
  const dataParam = event.url.searchParams.get('data');
  const [sudoku, walkthrough] = await Promise.all([
    trpcClient.sudokus.get.query({ id: sudokuId }),
    trpcClient.walkthroughs.get.query({ sudokuId })
  ]);
  if (sudoku == null) {
    throw error(404, 'Not found');
  }
  return {
    sudoku,
    walkthrough,
    initialGameData:
      dataParam != null
        ? (decompressFromBase64(dataParam.replace(/ /g, '+')) as GameData)
        : undefined
  };
};
