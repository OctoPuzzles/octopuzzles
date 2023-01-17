<script lang="ts">
	import type { Position } from '$models/Sudoku';
	import { gameHistory, highlights } from '$stores/sudokuStore';
	import Button from '$ui/Button.svelte';
	import Input from '$ui/Input.svelte';
	import deepCopy from '$utils/deepCopy';

	const { selectedCells } = highlights;

	let annotations = gameHistory.getValue('annotations');
	let input: Input;
	$: firstSelectedCell = $selectedCells.length === 1 ? $selectedCells[0] : undefined;

	$: if (firstSelectedCell) {
		populateFromSelectedCell(firstSelectedCell);
	}

	$: $selectedCells, input != null && setTimeout(() => input != null && input.focus(), 100);

	function populateFromSelectedCell(selectedCell: Position): void {
		value =
			$annotations.find((n) =>
				n.positions.some((p) => p.row === selectedCell.row && p.column === selectedCell.column)
			)?.details ?? '';
	}

	let value = '';

	$: handleInput(value);

	function handleInput(newValue: string): void {
		if (firstSelectedCell == null) return;

		let newAnnotations = deepCopy($annotations);
		let noteIndex = newAnnotations.findIndex((n) =>
			n.positions.some(
				(p) => p.row === firstSelectedCell?.row && p.column === firstSelectedCell?.column
			)
		);
		if (noteIndex !== -1) {
			if (newValue !== '') {
				newAnnotations.splice(noteIndex, 1, { ...newAnnotations[noteIndex], details: newValue });
			} else {
				newAnnotations.splice(noteIndex, 1);
			}
		} else if (newValue !== '') {
			newAnnotations.push({ positions: [firstSelectedCell], type: 'Note', details: newValue });
		}

		gameHistory.set({ annotations: newAnnotations });
	}
</script>

<div class="w-full h-full flex flex-col justify-center items-center p-2">
	<Input
		bind:this={input}
		asTextarea
		bind:value
		placeholder="note"
		disabled={$selectedCells.length !== 1}
		title={$selectedCells.length !== 1
			? 'Please select only one cell to make a note on'
			: 'Write a note'}
	/>

	<Button on:click={() => (value = '')} class="mt-2 w-full">Clear note</Button>
</div>
