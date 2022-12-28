<script lang="ts">
	import { walkthroughStore } from '$stores/walkthroughStore';
	import { gameHistory } from '$stores/sudokuStore';
	import SudokuDisplay from '$components/Sudoku/Display/index.svelte';
	import Button from '$ui/Button.svelte';
	import ArrowsCounterClockwise from 'phosphor-svelte/lib/ArrowsCounterClockwise/ArrowsCounterClockwise.svelte';
	import Trash from 'phosphor-svelte/lib/Trash/Trash.svelte';
	import Swap from 'phosphor-svelte/lib/Swap/Swap.svelte';
	import ArrowsOutLineVertical from 'phosphor-svelte/lib/ArrowsOutLineVertical/ArrowsOutLineVertical.svelte';
	import RichTextEditor from '$components/RichTextEditor.svelte';
	import type { EditorHistoryStep } from '$types';

	export let clues: EditorHistoryStep;

	function updateStepDescription(step: number, html: string): void {
		walkthroughStore.changeDescriptionOfStep(step, html);
	}
</script>

<div class="h-full flex-1 overflow-y-hidden flex flex-col">
	<div class="w-full flex-1 p-2 bg-gray-100 border-b border-gray-200">
		<h2 class="text-center font-bold text-2xl">Walkthrough</h2>
		<p>Info: We automatically save your walkthrough whenever you save your sudoku puzzle</p>
	</div>

	<div class="shrink overflow-y-auto p-4 flex flex-col">
		{#if $walkthroughStore.length === 0}
			<p class="text-gray-700">No steps added yet</p>
		{/if}
		{#each $walkthroughStore as { step, description }, i}
			<div>
				<div>
					<div class="flex space-x-4 items-center mb-2 mt-2">
						<h4 class="font-medium">Step {i + 1}</h4>
						<button
							class="w-6 h-6 rounded-full p-1 hover:bg-gray-100 hover:text-gray-600"
							on:click={() => {
								gameHistory.set(step);
							}}
							title="Reset to this step"><ArrowsCounterClockwise size={16} /></button
						>
						<button
							on:click={() => walkthroughStore.addStep(i)}
							title="Insert a new step"
							class="w-6 h-6 rounded-full p-1 hover:bg-red-100 hover:text-red-600"
							><ArrowsOutLineVertical size={16} /></button
						>
						<button
							on:click={() => walkthroughStore.addStep(i, true)}
							title="Replace this step"
							class="w-6 h-6 rounded-full p-1 hover:bg-red-100 hover:text-red-600"
							><Swap size={16} /></button
						>
						<button
							on:click={() => walkthroughStore.removeStep(i)}
							title="Delete this step"
							class="w-6 h-6 rounded-full p-1 hover:bg-red-100 hover:text-red-600"
							><Trash size={16} /></button
						>
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
						<div
							class="border border-gray-300 py-2 px-4 leading-5 rounded-md w-full focus:ring focus:ring-blue-300 focus:border-blue-500 disabled:bg-gray-200 h-full min-h-full"
						>
							<RichTextEditor
								content={description}
								onChange={(html) => updateStepDescription(i, html)}
								placeholder="Add a description"
							/>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="w-full flex justify-center mt-2 flex-1 bg-gray-100 py-3 border-t border-gray-200">
		<Button variant="primary" on:click={() => walkthroughStore.addStep()}>
			Add step to walkthrough
		</Button>
	</div>
</div>
