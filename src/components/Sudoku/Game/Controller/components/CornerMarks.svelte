<script lang="ts">
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import { get } from 'svelte/store';
	import deepCopy from '$utils/deepCopy';
	import classNames from 'classnames';
	import Keypad from '../Keypad.svelte';

	const { selectedCells } = highlights;
</script>

<Keypad
	getButtonInfo={(digit) => {
		return { class: 'p-1', customColor: false };
	}}
	handleDigit={(digit) => {
		let currentCornermarks = get(gameHistory.getValue('cornermarks'));
		let newCornermarks = deepCopy(currentCornermarks);
		const givens = editorHistory.getClue('givens');
		let positions = deepCopy(get(selectedCells));

		positions = positions.filter((p) => givens[p.row][p.column] === '');
		if (positions.length === 0) return;

		if (digit === '') {
			const clearAllGameCells = positions.every((p) => currentCornermarks[p.row][p.column] === '');
			if (clearAllGameCells) {
				// completely clear the selected cells
				gameHistory.clearCells(positions);
				return;
			} else {
				// Remove the center marks from all selected cells
				positions.forEach((p) => {
					newCornermarks[p.row][p.column] = '';
				});
			}
		} else {
			let allCellsHasCornerMark = positions.every((p) =>
				currentCornermarks[p.row][p.column].includes(digit)
			);

			if (!allCellsHasCornerMark) {
				// Add it to the cells that does not have it
				positions.forEach((p) => {
					if (!currentCornermarks[p.row][p.column].includes(digit)) {
						newCornermarks[p.row][p.column] = (currentCornermarks[p.row][p.column] + digit)
							.split('')
							.sort()
							.join('');
					}
				});
			} else {
				// Remove it from all cells
				positions.forEach((p) => {
					newCornermarks[p.row][p.column] = currentCornermarks[p.row][p.column]
						.split('')
						.filter((s) => s !== digit)
						.join('');
				});
			}
		}

		gameHistory.set({ cornermarks: newCornermarks });
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
