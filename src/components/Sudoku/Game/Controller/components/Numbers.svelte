<script lang="ts">
	import SquareButton from '$ui/SquareButton.svelte';
	import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import deepCopy from '$utils/deepCopy';
	import { get } from 'svelte/store';
	import { isDeleteKey } from '$utils/keyboard/isDeleteKey';
	import { hasOpenModals } from '$stores/modalStore';
	import { scanner } from '$stores/sudokuStore/scanner';
	import { settings } from '$stores/settingsStore';

	const { selectedCells } = highlights;

	function handleClick(newValue: string): void {
		const givens = editorHistory.getClue('givens');
		const positions = get(selectedCells).filter((p) => !(givens[p.row]?.[p.column] !== ''));
		if (positions.length === 0) return;

		const currentValues = get(gameHistory.getValue('values'));
		const currentModifiers = get(gameHistory.getValue('modifiers'));
		const newValues = deepCopy(currentValues);
		const newCentermarks = deepCopy(get(gameHistory.getValue('centermarks')));
		const newCornermarks = deepCopy(get(gameHistory.getValue('cornermarks')));
		let newModifiers = deepCopy(currentModifiers);

		if (newValue === '/' || newValue === '*') {
			const modifierType = newValue === '/' ? 'SCell' : 'Doubler';
			const allCellsHaveModifier = positions.every((p) =>
				currentModifiers.some(
					(m) =>
						m.type === modifierType && m.position.row === p.row && m.position.column === p.column
				)
			);

			if (!allCellsHaveModifier) {
				positions.forEach((p) => {
					if (
						!currentModifiers.some(
							(m) =>
								m.type === modifierType &&
								m.position.row === p.row &&
								m.position.column === p.column
						)
					) {
						newModifiers.push({ position: p, type: modifierType });
					}
				});
			} else {
				newModifiers = newModifiers.filter(
					(m) =>
						m.type !== modifierType ||
						!positions.some((p) => m.position.row === p.row && m.position.column === p.column)
				);
			}

			gameHistory.set({
				modifiers: newModifiers
			});
			return;
		}

		// Check if we should clear all game cells
		const clearAllGameCells =
			newValue === '' && positions.every((p) => currentValues[p.row][p.column] === '');
		if (clearAllGameCells) {
			// clear all the cells in the game
			gameHistory.clearCells(positions);
		} else {
			// Whether there has been any changes
			let anyChanges = false;
			let runScan = false;

			// If we are deleting a cell
			if (newValue === '') {
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
						return currentValues[p.row][p.column].split('/').includes(newValue);
					} else {
						return currentValues[p.row][p.column] === newValue;
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

							newValues[p.row][p.column] = [cellValues[0], newValue].sort().join('/');
							newCentermarks[p.row][p.column] = '';
							newCornermarks[p.row][p.column] = '';
						} else if (currentValues[p.row][p.column] !== newValue) {
							// Insert the number
							newValues[p.row][p.column] = newValue;
							if (isSCell) {
								positions.forEach((p) => {
									newCentermarks[p.row][p.column] = newCentermarks[p.row][p.column]
										.split('')
										.filter((s) => s !== newValue)
										.join('');
									newCornermarks[p.row][p.column] = newCornermarks[p.row][p.column]
										.split('')
										.filter((s) => s !== newValue)
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
								currentValues[p.row][p.column].split('/').find((v) => v !== newValue) ?? '';
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
	}

	function handleKeyDown(k: KeyboardEvent): void {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (isDeleteKey(k)) {
			handleClick('');
		} else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', '*'].includes(k.key)) {
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
