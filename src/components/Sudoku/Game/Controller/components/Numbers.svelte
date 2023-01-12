<script lang="ts">
	import SquareButton from '$ui/SquareButton.svelte';
	import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import deepCopy from '$utils/deepCopy';
	import { get } from 'svelte/store';
	import { isDeleteKey } from '$utils/keyboard/isDeleteKey';
	import { hasOpenModals } from '$stores/modalStore';
	import { me } from '$stores/meStore';
	import { scanner } from '$stores/sudokuStore/scanner';

	const { selectedCells } = highlights;

	function handleClick(newValue: string): void {
		const positions = get(selectedCells);
		if (positions.length === 0) return;

		const currentValues = get(gameHistory.getValue('values'));
		const newValues = deepCopy(currentValues);
		const newCentermarks = deepCopy(get(gameHistory.getValue('centermarks')));
		const newCornermarks = deepCopy(get(gameHistory.getValue('cornermarks')));
		const givens = editorHistory.getClue('givens');

		// Check if we should clear all game cells
		const clearAllGameCells =
			newValue === '' && positions.every((p) => currentValues[p.row]?.[p.column] === '');
		if (clearAllGameCells) {
			// clear all the cells in the game
			gameHistory.clearCells(positions);
		} else {
			// Whether there has been any changes
			let anyChanges = false;
			let runScan = false;

			for (const position of positions) {
				// don't put anything on top of a given
				if (givens[position.row]?.[position.column] !== '') continue;

				// If we are deleting a cell
				if (newValue === '') {
					// If the cell is already empty
					if (newValues[position.row][position.column] === '') return;

					// Delete the value in the cell
					newValues[position.row][position.column] = '';
					anyChanges = true;
				} else {
					// We are putting some number in the cell

					// If the cell already contains the number, delete it
					if (newValues[position.row][position.column] === newValue) {
						newValues[position.row][position.column] = '';
						anyChanges = true;
					} else {
						// Insert the number
						newValues[position.row][position.column] = newValue;
						newCentermarks[position.row][position.column] = '';
						newCornermarks[position.row][position.column] = '';
						anyChanges = true;
						runScan = me.getSettings().scanner?.autoScan ?? false;
					}
				}
			}

			// If there has actually been any changes, update the game history
			if (anyChanges) {
				gameHistory.set({ values: newValues });

				if (runScan) {
					scanner.startScan(positions[0]);
				}
			}
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
				<SquareButton variant="secondary" class="text-3xl" on:click={() => handleClick(String(i))}
					>{String(i)}</SquareButton
				>
			</div>
		{/each}
		<div class="col-span-2">
			<SquareButton class="w-36 p-3" on:click={() => handleClick('')}>
				<Backspace size={32} />
			</SquareButton>
		</div>
	</div>
</div>
