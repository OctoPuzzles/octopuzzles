<script lang="ts">
	import { gameHistory } from '$stores/sudokuStore';
	import SudokuDisplay from '$components/Sudoku/Display/index.svelte';
	import ArrowsCounterClockwise from 'phosphor-svelte/lib/ArrowsCounterClockwise/ArrowsCounterClockwise.svelte';
	import AppWindow from 'phosphor-svelte/lib/AppWindow/AppWindow.svelte';
	import { page } from '$app/stores';
	import classNames from 'classnames';
	import HtmlContent from '$components/HTMLContent.svelte';
	import type { EditorHistoryStep } from '$types';
	import type { WalkthroughStep } from '$models/Walkthrough';

	const inModal = !$page.url.pathname.endsWith('/walkthrough');

	export let clues: EditorHistoryStep;
	export let walkthrough: WalkthroughStep[];
</script>

<div class="h-full flex-1 overflow-y-hidden flex flex-col">
	<div
		class={classNames(
			'w-full flex-1 p-2 relative',
			inModal && 'bg-gray-100 border-b border-gray-200'
		)}
	>
		{#if inModal}
			<a
				class="absolute right-1 top-1"
				href={`${$page.url.pathname}/walkthrough`}
				title="Open in another tab"
				target="_blank"
				rel="noreferrer noopener"
			>
				<AppWindow />
			</a>
		{/if}
		<h2 class="text-center font-bold text-2xl">Walkthrough</h2>
	</div>

	<div class="shrink overflow-y-auto p-4">
		{#each walkthrough as { step, description }, i}
			<div>
				<div class="flex space-x-4 items-center mb-2 mt-2">
					<h4 class="font-medium">Step {i + 1}</h4>
					{#if inModal}
						<button
							class="w-6 h-6 rounded-full p-1 hover:bg-gray-100 hover:text-gray-600"
							on:click={() => {
								gameHistory.set(step);
							}}
							title="Reset to this step"><ArrowsCounterClockwise size={16} /></button
						>
					{/if}
				</div>
			</div>
			<div class="grid gap-2 grid-cols-2">
				<div>
					<SudokuDisplay
						borderClues={clues.borderclues}
						cages={clues.extendedcages}
						cellClues={clues.cellclues}
						cells={clues.cells}
						dimensions={clues.dimensions}
						editorColors={clues.colors}
						givens={clues.givens}
						logic={clues.logic}
						paths={clues.paths}
						regions={clues.regions}
						cornermarks={step.cornermarks}
						centermarks={step.centermarks}
						values={step.values}
						gameColors={step.colors}
						notes={step.notes}
					/>
				</div>
				<div>
					<HtmlContent content={description} />
				</div>
			</div>
		{/each}
	</div>
</div>
