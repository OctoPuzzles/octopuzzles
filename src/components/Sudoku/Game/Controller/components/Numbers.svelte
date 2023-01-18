<script lang="ts">
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import deepCopy from '$utils/deepCopy';
	import { get } from 'svelte/store';
	import { scanner } from '$stores/sudokuStore/scanner';
	import { settings } from '$stores/settingsStore';
	import Keypad from '../Keypad.svelte';

	const { selectedCells } = highlights;
</script>

<Keypad
	handleDigit={(digit) => {
		const givens = editorHistory.getClue('givens');
		const positions = get(selectedCells).filter((p) => !(givens[p.row]?.[p.column] !== ''));
		if (positions.length === 0) return;

		const currentValues = get(gameHistory.getValue('values'));
		const currentModifiers = get(gameHistory.getValue('modifiers'));
		const newValues = deepCopy(currentValues);
		const newCentermarks = deepCopy(get(gameHistory.getValue('centermarks')));
		const newCornermarks = deepCopy(get(gameHistory.getValue('cornermarks')));

		// Check if we should clear all game cells
		const clearAllGameCells =
			digit === '' && positions.every((p) => currentValues[p.row][p.column] === '');
		if (clearAllGameCells) {
			// clear all the cells in the game
			gameHistory.clearCells(positions);
		} else {
			// Whether there has been any changes
			let anyChanges = false;
			let runScan = false;

			// If we are deleting a cell
			if (digit === '') {
				for (const position of positions) {
					// If the cell is already empty
					if (newValues[position.row][position.column] === '') continue;

					// Delete the value in the cell
					newValues[position.row][position.column] = '';
					anyChanges = true;
				}
			} else {
				// We are putting some number in the cell
				let allCellsHaveValue = positions.every((p) => {
					const isSCell = currentModifiers.some(
						(m) => m.type === 'SCell' && m.position.row === p.row && m.position.column === p.column
					);
					if (isSCell) {
						return currentValues[p.row][p.column].split('/').includes(digit);
					} else {
						return currentValues[p.row][p.column] === digit;
					}
				});

				if (!allCellsHaveValue) {
					// Add it to the cells that do not have it
					positions.forEach((p) => {
						const isSCell = currentModifiers.some(
							(m) =>
								m.type === 'SCell' && m.position.row === p.row && m.position.column === p.column
						);
						if (isSCell && currentValues[p.row][p.column] !== '') {
							let cellValues = currentValues[p.row][p.column].split('/');

							newValues[p.row][p.column] = [cellValues[0], digit].sort().join('/');
							newCentermarks[p.row][p.column] = '';
							newCornermarks[p.row][p.column] = '';
						} else if (currentValues[p.row][p.column] !== digit) {
							// Insert the number
							newValues[p.row][p.column] = digit;
							if (isSCell) {
								positions.forEach((p) => {
									newCentermarks[p.row][p.column] = newCentermarks[p.row][p.column]
										.split('')
										.filter((s) => s !== digit)
										.join('');
									newCornermarks[p.row][p.column] = newCornermarks[p.row][p.column]
										.split('')
										.filter((s) => s !== digit)
										.join('');
								});
							} else {
								newCentermarks[p.row][p.column] = '';
								newCornermarks[p.row][p.column] = '';
							}
						} else {
							return;
						}
						anyChanges = true;
						runScan = get(settings.getGroup('scanner'))?.autoScan ?? false;
					});
				} else {
					// Remove it from all cells
					positions.forEach((p) => {
						const isSCell = currentModifiers.some(
							(m) =>
								m.type === 'SCell' && m.position.row === p.row && m.position.column === p.column
						);
						if (isSCell && currentValues[p.row][p.column].includes('/')) {
							newValues[p.row][p.column] =
								currentValues[p.row][p.column].split('/').find((v) => v !== digit) ?? '';
						} else {
							newValues[p.row][p.column] = '';
						}
						anyChanges = true;
					});
				}

				// If there has actually been any changes, update the game history
				if (anyChanges) {
					gameHistory.set({
						values: newValues,
						cornermarks: newCornermarks,
						centermarks: newCentermarks
					});

					if (runScan) {
						scanner.startScan(positions[0]);
					}
				}
			}
		}
	}}
>
	<div slot="digit" let:digit>
		{digit}
	</div>
</Keypad>
