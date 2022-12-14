<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SudokuGame from '$components/Sudoku/Game/SudokuGame.svelte';
	import { editorHistory, gameHistory } from '$stores/sudokuStore';
	import { decompressFromBase64 } from '$features/fpuzzles/compressor';
	import { defaultValues } from '$utils/defaults';
	import { importFPuzzleIntoEditorHistory } from '$features/fpuzzles/importFPuzzleIntoEditor';
	import { onDestroy, onMount } from 'svelte';
	import { resetAllSudokuStores } from '$utils/resetAllStores';

	// TIMER: one that does not run when the tab is inactive, but runs as if it had.
	let now = Date.now();
	const start = Date.now();
	let timer: ReturnType<typeof setInterval>;
	let loading = true;

	$: t = Math.floor((now - start) / 1000);

	$: seconds = `0${t % 60}`.slice(-2);
	$: minutes = `0${Math.floor(t / 60) % 60}`.slice(-2);
	$: hours = t >= 3600 ? `0${Math.floor(t / 3600) % 24}`.slice(-2) + ':' : '';
	$: days = t >= 86400 ? Math.floor(t / 86400) + 'd' : '';

	const sudokuTitle = editorHistory.title;
	const description = editorHistory.description;

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

	onMount(async () => {
		loading = true;
		const encodedString = $page.url.searchParams.get('fpuzzle');
		if (encodedString == null) {
			await goto('/');
			return;
		}
		const withPlusses = encodedString.replace(/ /g, '+');

		const jsonString = decompressFromBase64(withPlusses);

		if (jsonString == null) {
			await goto('/');
			return;
		}

		importFPuzzleIntoEditorHistory(jsonString);

		let dim = editorHistory.getClue('dimensions');
		gameHistory.set({ values: defaultValues(dim) });
		loading = false;
	});

	onDestroy(() => {
		resetAllSudokuStores();
	});

	const sudokuClues = editorHistory.subscribeToClues();
	const userInputs = gameHistory.subscribeToInputs();
</script>

<svelte:head>
	<title>{$sudokuTitle ?? 'Sudoku'} | OctoPuzzles</title>
	<meta name="description" content={$description} />
	<meta property="og:image" content="https://octopuzzles.com/favicon.png" />
	<meta property="og:description" content={$description} />
	<meta property="og:title" content="{$sudokuTitle} | OctoPuzzles" />
</svelte:head>

{#if !loading}
	<!-- Header -->
	<div class="flex items-center justify-center h-20 absolute top-0 w-full pointer-events-none">
		<div class="flex flex-col items-center">
			<h1 class="text-xl font-medium text-center w-96 md:w-auto truncate">
				{$sudokuTitle}
			</h1>
			<span>
				{days}
				{hours}{minutes}:{seconds}
			</span>
		</div>
	</div>

	<SudokuGame clues={$sudokuClues} userInputs={$userInputs} />

	<div class="p-4 whitespace-pre-line">
		{$description}
	</div>
{/if}
