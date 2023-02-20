<script lang="ts">
	import SquareButton from '$ui/SquareButton.svelte';
	import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
	import { editorHistory, highlights } from '$stores/sudokuStore';
	import deepCopy from '$utils/deepCopy';
	import { get } from 'svelte/store';
	import { isDeleteKey } from '$utils/keyboard/isDeleteKey';
	import { hasOpenModals } from '$stores/modalStore';

	const { selectedCells } = highlights;
	const givens = editorHistory.getClue('givens');

	function handleClick(newGiven: string): void {
		const positions = get(selectedCells);
		if (positions.length === 0) return;

		const currentGivens = $givens;
		const newGivens = deepCopy(currentGivens);

		// Whether there has been any changes
		let anyChanges = false;

		// Check if we should clear all game cells
		const clearAllEditorCells =
			newGiven === '' && positions.every((p) => newGivens[p.row]?.[p.column] === '');
		if (clearAllEditorCells) {
			// clear all the cells in the game
			editorHistory.clearCells(positions);
		} else {
			for (const position of positions) {
				// If we are deleting a cell

				if (newGiven === '') {
					// If the cell is already empty
					if (newGivens[position.row][position.column] === '') continue;

					// Delete the value in the cell
					newGivens[position.row][position.column] = '';
					anyChanges = true;
				} else {
					// We are putting some number in the cell

					// If the cell already contains the number, delete it
					newGivens[position.row][position.column] = (
						newGivens[position.row][position.column] + newGiven
					).slice(0, 3);
					anyChanges = true;
				}
			}
		}

		// If there has actually been any changes, update the game history
		if (anyChanges) {
			editorHistory.set({ givens: newGivens });
		}
	}

	function handleKeyDown(k: KeyboardEvent): void {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (isDeleteKey(k)) {
			handleClick('');
		} else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(k.key)) {
			handleClick(k.key);
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="w-full h-full flex justify-center items-center">
	<div class="grid grid-cols-3 grid-rows-4 h-max w-max m-auto p-4 gap-4">
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as i}
			<div>
				<SquareButton variant="secondary" class="text-3xl" on:click={() => handleClick(String(i))}>
					{String(i)}
				</SquareButton>
			</div>
		{/each}
		<div class="col-span-2">
			<SquareButton class="w-36 p-3" on:click={() => handleClick('')}>
				<Backspace size={32} data-testid="givens-delete-button" />
			</SquareButton>
		</div>
	</div>
</div>
