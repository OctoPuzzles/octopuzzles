<script lang="ts">
	import html2canvas from 'html2canvas';
	import SudokuGame from '$components/Sudoku/Game/SudokuGame.svelte';
	import SudokuInfo from '$components/Sudoku/SudokuInfo.svelte';
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { openModal } from '$stores/modalStore';
	import FinishedSudokuModal from '$components/Modals/FinishedSudokuModal.svelte';
	import type { PageData } from './$types';
	import { walkthroughStore } from '$stores/walkthroughStore';
	import { fillWalkthroughStore } from '$utils/fillWalkthroughStore';
	import { resetAllSudokuStores } from '$utils/resetAllStores';
	import trpc from '$lib/client/trpc';
	import { scanner } from '$stores/sudokuStore/scanner';
	import { settings } from '$stores/settingsStore';
	import { getValuesFromRange } from '$utils/keyboard/getValuesFromRange';

	export let data: PageData;

	const { wrongCells } = highlights;

	const sudokuTitle = editorHistory.title;
	const description = editorHistory.description;
	const solution = editorHistory.solution;

	$: if (data.walkthrough?.steps) {
		// Just so ts will shut up
		fillWalkthroughStore(data.walkthrough);
	} else {
		walkthroughStore.set([]);
	}

	// TIMER: one that does not run when the tab is inactive, but runs as if it had.
	let now = Date.now();
	const start = Date.now();
	let timer: ReturnType<typeof setInterval>;

	$: t = Math.floor((now - start) / 1000);

	$: seconds = `0${t % 60}`.slice(-2);
	$: minutes = `0${Math.floor(t / 60) % 60}`.slice(-2);
	$: hours = t >= 3600 ? `0${Math.floor(t / 3600) % 24}`.slice(-2) + ':' : '';
	$: days = t >= 86400 ? Math.floor(t / 86400) + 'd ' : '';

	// When the page is not visible, the timer should not run, but it should also not stop, but be incremented by the number of seconds the user was off screen
	function handleVisibilityChange(): void {
		if (document.hidden) {
			clearInterval(timer);
		} else {
			timer = setInterval(() => {
				now = Date.now();
			}, 1000);
		}
	}
	onMount(() => {
		timer = setInterval(() => {
			now = Date.now();
		}, 1000);
		document.addEventListener('visibilitychange', handleVisibilityChange);
	});

	onDestroy(() => {
		resetAllSudokuStores();
	});

	onMount(async () => {
		let sud = data.sudoku;
		if (!sud) {
			await goto('/');
			return;
		}

		$sudokuTitle = sud.title;
		$description = sud.description;

		editorHistory.reset({
			borderclues: sud.borderclues ?? undefined,
			cellclues: sud.cellclues ?? undefined,
			regions: sud.regions ?? undefined,
			givens: sud.givens ?? undefined,
			cells: sud.cells ?? undefined,
			colors: sud.colors ?? undefined,
			extendedcages: sud.extendedcages ?? undefined,
			paths: sud.paths ?? undefined,
			dimensions: sud.dimensions,
			logic: sud.logic ?? undefined
		});
		if (data.gameData) {
			gameHistory.set(data.gameData);
		} else {
			gameHistory.reset();
		}

		trpc().mutation('userStats:viewed', { sudokuId: sud.id });
	});

	const sudokuClues = editorHistory.subscribeToClues();
	const gameData = gameHistory.subscribeToInputs();

	let generalSettings = settings.getGroup('general');

	function checkSolution(): boolean {
		const allDigits = getValuesFromRange(
			$sudokuClues.logic.digits ??
				($sudokuClues.logic.flags?.includes('SCells') ? '0-' : '1-') +
					($sudokuClues.dimensions.rows -
						($sudokuClues.dimensions.margins?.top ?? 0) -
						($sudokuClues.dimensions.margins?.bottom ?? 0))
		);
		//check that every row has the required number of digits before validating the solution
		if (
			$gameData.cellValues.some((row, i) => {
				let numDigits = 0;
				row.forEach((cell, j) => {
					numDigits += $sudokuClues.givens[i][j] !== '' ? 1 : cell.digits?.length ?? 0;
				});
				return numDigits === allDigits.length;
			})
		) {
			return false;
		}
		//check that the provided solution has the same dimensions as the user input
		if ($solution != null) {
			if (
				$solution.length !== $gameData.cellValues.length ||
				$solution[0].length !== $gameData.cellValues[0].length
			) {
				return false;
			}
		}

		//check for errors against the provided solution or the puzzle logic
		const errorCells = scanner.getErrorCells($solution);
		if (($generalSettings?.verificationMode ?? 'OnDemand') === 'OnComplete') {
			$wrongCells = errorCells;
		}

		return errorCells.length === 0;
	}

	function showDoneModal(): void {
		if (data.sudoku?.id) {
			openModal(FinishedSudokuModal, {
				sudokuId: data.sudoku.id,
				takeScreenshot,
				finishTime: `${days}${hours}${minutes}:${seconds}`
			});
		}
	}

	$: if (checkSolution()) {
		clearInterval(timer);
		trpc().mutation('userStats:solved', { sudokuId: data.sudoku.id, solveTime: t });
		if (data?.gameData) {
			trpc().mutation('savedGames:delete', { sudokuId: data.sudoku.id });
		}
		showDoneModal();
	}

	function takeScreenshot(): void {
		const sudokuDisplay = document.querySelector<HTMLElement>('#sudoku-display');
		if (sudokuDisplay == null) return;

		html2canvas(sudokuDisplay).then((canvas) => {
			const base64image = canvas.toDataURL('image/png');
			window.open(base64image);
		});
	}
</script>

<svelte:head>
	<title>{data.sudoku.title} | OctoPuzzles</title>
	<meta name="description" content={data.sudoku?.description} />

	<meta property="og:title" content="{data.sudoku?.title ?? 'Sudoku'} | OctoPuzzles" />
	<meta property="og:description" content={data.sudoku?.description} />
	<meta property="og:url" content="http://www.octopuzzles.com/sudoku/{data.sudoku.id}" />
	<meta property="og:type" content="website" />
</svelte:head>

<!-- Header -->
<div class="flex items-center justify-center h-20 absolute top-0 w-full pointer-events-none">
	<div class="flex w-full justify-end sm:justify-center">
		<div class="flex flex-col items-center">
			<h1 class="text-xl font-medium text-center w-96 md:w-auto truncate">
				{data.sudoku.title}
			</h1>
			<span>
				{days}
				{hours}{minutes}:{seconds}
			</span>
		</div>
	</div>
</div>

<SudokuGame clues={$sudokuClues} gameData={$gameData} />

<SudokuInfo sudoku={data.sudoku} {takeScreenshot} />
