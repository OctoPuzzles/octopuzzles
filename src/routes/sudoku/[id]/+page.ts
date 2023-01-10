import trpc from '$lib/client/trpc';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { decompressFromBase64 } from '$features/compressor';
import type { SolutionStep } from '$models/Walkthrough';

export const load: PageLoad = async ({ fetch, params, url }) => {
	const trpcClient = trpc(fetch);
	const sudokuId = parseInt(params.id);
	const dataParam = url.searchParams.get('data');
	const [sudoku, walkthrough, savedGame] = await Promise.all([
		trpcClient.query('sudokus:get', { id: sudokuId }),
		trpcClient.query('walkthroughs:get', { sudokuId }),
		trpcClient.query('savedGames:get', { sudokuId }),
		trpcClient.mutation('userStats:viewed', { sudokuId })
	]);
	if (sudoku == null) {
		throw error(404, 'Not found');
	}
	return {
		sudoku,
		walkthrough,
		gameData: dataParam
			? (decompressFromBase64(dataParam.replace(/ /g, '+')) as SolutionStep)
			: savedGame?.gameData
	};
};
