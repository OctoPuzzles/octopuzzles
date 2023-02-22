<script lang="ts">
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import { get } from 'svelte/store';
	import deepCopy from '$utils/deepCopy';
	import classNames from 'classnames';
	import Keypad from '../Keypad.svelte';
	import { undefinedIfEmpty } from '$utils/undefinedIfEmpty';

	const { selectedCells } = highlights;
	const givens = editorHistory.getClue('givens');
</script>

<Keypad
	getButtonInfo={() => {
		return { class: 'p-1', custom: false };
	}}
	handleDigit={(digit) => {
		let currentCellValues = get(gameHistory.getValue('cellValues'));
		let newCellValues = deepCopy(currentCellValues);
		let positions = deepCopy(get(selectedCells));

		positions = positions.filter((p) => $givens[p.row][p.column] === '');
		if (positions.length === 0) return;

		if (digit === '') {
			const clearAllGameCells = positions.every(
				(p) => !currentCellValues[p.row][p.column].cornermarks
			);
			if (clearAllGameCells) {
				// completely clear the selected cells
				gameHistory.clearCells(positions);
				return;
			} else {
				// Remove the center marks from all selected cells
				positions.forEach((p) => {
					delete newCellValues[p.row][p.column].cornermarks;
				});
			}
		} else {
			let allCellsHasCornerMark = positions.every((p) =>
				currentCellValues[p.row][p.column].cornermarks?.includes(digit)
			);

			if (!allCellsHasCornerMark) {
				// Add it to the cells that does not have it
				positions.forEach((p) => {
					const cornermarks = currentCellValues[p.row][p.column].cornermarks;
					if (cornermarks) {
						if (!cornermarks.includes(digit)) {
							newCellValues[p.row][p.column].cornermarks = [...cornermarks, digit].sort();
						}
					} else {
						newCellValues[p.row][p.column].cornermarks = [digit];
					}
				});
			} else {
				// Remove it from all cells
				positions.forEach((p) => {
					const cornermarks = currentCellValues[p.row][p.column].cornermarks;
					if (cornermarks) {
						newCellValues[p.row][p.column].cornermarks = undefinedIfEmpty(
							cornermarks.filter((s) => s !== digit)
						);
					}
				});
			}
		}

		gameHistory.set({ cellValues: newCellValues });
	}}
>
	<div slot="digit" let:digit>
		<div class="w-full h-full relative">
			<p
				class={classNames('absolute', {
					'left-0': (parseInt(digit) - 1) % 3 === 0,
					'left-1/2 -translate-x-1/2': (parseInt(digit) - 1) % 3 === 1,
					'right-0': (parseInt(digit) - 1) % 3 === 2,
					'top-0': Math.floor((parseInt(digit) - 1) / 3) === 0,
					'top-1/2 -translate-y-1/2': Math.floor((parseInt(digit) - 1) / 3) === 1,
					'bottom-0': Math.floor((parseInt(digit) - 1) / 3) === 2,
					'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2': parseInt(digit) === 0
				})}
			>
				{digit}
			</p>
		</div>
	</div>
</Keypad>
