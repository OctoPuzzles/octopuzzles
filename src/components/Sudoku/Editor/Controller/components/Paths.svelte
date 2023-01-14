<script lang="ts">
	import { pathTypeNames, pathTypesToLabel } from '$constants';
	import type { Form, Path, PathType, Position } from '$models/Sudoku';
	import { hasOpenModals } from '$stores/modalStore';
	import {
		editorHistory,
		handleArrows,
		handleMouseDown,
		handleMouseEnter,
		highlights
	} from '$stores/sudokuStore';
	import type {
		ArrowHandler,
		MouseDownHandler,
		MouseEnterHandler
	} from '$stores/sudokuStore/interactionHandlers';
	import { defaultHandleArrows } from '$stores/sudokuStore/interactionHandlers';
	import Button from '$ui/Button.svelte';
	import Checkbox from '$ui/Checkbox.svelte';
	import ColorSelect from '$ui/ColorSelect.svelte';
	import ControllerButton from '$ui/ControllerButton.svelte';
	import Label from '$ui/Label.svelte';
	import RadioGroup from '$ui/RadioGroup.svelte';
	import Range from '$ui/Range.svelte';
	import Select from '$ui/Select.svelte';
	import deepCopy from '$utils/deepCopy';
	import { isDeleteKey } from '$utils/keyboard/isDeleteKey';
	import { isCommandKey } from '$utils/keyboard/isCommandKey';
	import moveArrayElement from '$utils/moveArrayElement';
	import { pathDefaults } from '$utils/constraints/paths';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { default as PathComponent } from '$components/Sudoku/Display/Clues/paths/Path.svelte';
	import ScaledSvg from '$components/Sudoku/Display/ScaledSvg.svelte';

	const { selectedItemIndex, selectedCells, highlightedCells, highlightedItemIndex } = highlights;
	const sudokuClues = editorHistory.subscribeToClues();
	const labels = editorHistory.labels;

	let type: PathType | 'CUSTOM' = $sudokuClues.paths[0]?.type ?? 'CUSTOM';
	let defaultSettings = pathDefaults(type);
	let { color, width, form, fill, arrow, uniqueDigits } = defaultSettings;
	$: hollow = fill === 'Hollow';

	$: color, updateSelectedPath();

	const forms: Form[] = ['Round', 'Square', 'Diamond'];
	const pathTypes: (PathType | 'CUSTOM')[] = [
		'Arrow',
		'Thermo',
		'Between',
		'Lockout',
		'Renban',
		'Whisper',
		'DutchWhisper',
		'Palindrome',
		'AntiFactor',
		'EqualSum',
		'ProductSum',
		'Entropic',
		'Parity',
		'Odd',
		'Even',
		'Pill',
		'CUSTOM'
	];

	$: if ($selectedItemIndex >= 0) {
		pathSelected($selectedItemIndex);
	}

	function pathSelected(selectedItemIndex: number): void {
		const path = $sudokuClues.paths[selectedItemIndex];
		if (path == null) return;
		updateSettings(path);
	}

	function updateSettings(path: Partial<Path>) {
		type = path.type ?? 'CUSTOM';
		defaultSettings = pathDefaults(type);
		color = path.color ?? defaultSettings.color;
		width = path.width ?? defaultSettings.width;
		form = path.form ?? defaultSettings.form;
		fill = path.fill ?? defaultSettings.fill;
		hollow = fill === 'Hollow';
		arrow = path.arrow ?? defaultSettings.arrow;
		uniqueDigits = path.uniqueDigits ?? defaultSettings.uniqueDigits;
	}

	function onChangeType() {
		updateSettings(type !== 'CUSTOM' ? { type } : {});

		updateSelectedPath();
	}

	function toggleHollow(): void {
		if (fill === 'Solid') {
			fill = 'Hollow';
		} else {
			fill = 'Solid';
		}

		updateSelectedPath();
	}

	function toggleArrow(): void {
		arrow = !arrow;

		updateSelectedPath();
	}

	function toggleUniqueDigits(): void {
		uniqueDigits = !uniqueDigits;

		updateSelectedPath();
	}

	function updateSelectedPath(): void {
		if ($selectedItemIndex === -1) return;

		let newPaths: Path[] = [];
		$sudokuClues.paths.forEach((path, i) => {
			if (i !== $selectedItemIndex) {
				newPaths = [...newPaths, path];
			} else {
				newPaths = [...newPaths, newPath(path.positions)];

				if (type !== path.type) {
					addLabel();
				}
			}
		});
		editorHistory.set({ paths: newPaths });
	}

	function deletePathAtIndex(index: number): void {
		const newPaths = $sudokuClues.paths.filter((_, i) => index !== i);
		$selectedCells = [];
		$highlightedCells = [];
		$selectedItemIndex = -1;
		editorHistory.set({ paths: newPaths });
	}

	function reorderPath(index: number, way: 'up' | 'down'): void {
		let newPaths: Path[] = [];
		if (way === 'up') {
			if (index === 0) return;
			newPaths = moveArrayElement($sudokuClues.paths, index, index - 1);
			if (index === $selectedItemIndex) {
				$selectedItemIndex--;
			} else if (index - 1 === $selectedItemIndex) {
				$selectedItemIndex++;
			}
		} else if (way === 'down') {
			if (index === $sudokuClues.paths.length - 1) return;
			newPaths = moveArrayElement($sudokuClues.paths, index, index + 1);
			if (index === $selectedItemIndex) {
				$selectedItemIndex++;
			} else if (index + 1 === $selectedItemIndex) {
				$selectedItemIndex--;
			}
		}
		editorHistory.set({ paths: newPaths });
	}

	function newPath(positions: Position[]): Path {
		return {
			positions,
			type: type !== 'CUSTOM' ? type : undefined,
			color: type === 'CUSTOM' || color != defaultSettings.color ? color : undefined,
			width: type === 'CUSTOM' || width != defaultSettings.width ? width : undefined,
			form: type === 'CUSTOM' || form != defaultSettings.form ? form : undefined,
			fill: type === 'CUSTOM' || fill != defaultSettings.fill ? fill : undefined,
			arrow: type === 'CUSTOM' || arrow != defaultSettings.arrow ? arrow : undefined,
			uniqueDigits:
				type === 'CUSTOM' || uniqueDigits != defaultSettings.uniqueDigits ? uniqueDigits : undefined
		};
	}

	function newPathFromSelection(): void {
		if ($selectedCells.length > 0) {
			editorHistory.set({
				paths: [...deepCopy($sudokuClues.paths), newPath(deepCopy($selectedCells))]
			});
			$selectedItemIndex = $sudokuClues.paths.length - 1;

			addLabel();
		}
	}

	function addLabel() {
		if (type === 'CUSTOM') {
			const label = $labels.find((l) => l.label.name === pathTypesToLabel[type as PathType]);
			if (label) {
				label.selected = true;
			}
		}
	}

	function addCellToSelectedPath(cell: Position, keep = true): void {
		const newPaths: Path[] = [];
		const selectedPathIndex = $selectedItemIndex;
		let removed = false;

		$sudokuClues.paths.map((path, i) => {
			if (i === selectedPathIndex) {
				let found = false;
				let newPositions = path.positions.filter((c) => {
					if (c.row === cell.row && c.column === cell.column) {
						found = true;
						return keep;
					}
					return true;
				});
				if (!found) {
					newPositions = [...newPositions, cell];
				}
				if (newPositions.length > 0) {
					newPaths.push({ ...path, positions: newPositions });
				} else {
					removed = true;
				}
			} else {
				newPaths.push(path);
			}
		});
		editorHistory.set({ paths: newPaths });
		if (!removed) {
			$selectedCells = newPaths[selectedPathIndex]?.positions ?? [];
			$selectedItemIndex = selectedPathIndex;
		} else {
			$selectedCells = [];
		}
	}

	const customHandleMouseDown: MouseDownHandler = ({ cell, metaButtonClicked }) => {
		if (!metaButtonClicked) {
			selectedCells.set([cell]);
		} else {
			if ($selectedItemIndex > -1) {
				addCellToSelectedPath(cell, false);
			} else {
				selectedCells.addCell(cell);
			}
		}
	};

	const customHandleMouseEnter: MouseEnterHandler = ({ cell, mouseDown }) => {
		if (!mouseDown) return;

		if ($selectedItemIndex === -1) {
			selectedCells.addCell(cell);
		} else {
			if ($selectedCells.length > 0) {
				addCellToSelectedPath(cell);
			}
		}
	};

	const customHandleArrows: ArrowHandler = ({ k, metaButtonClicked }) => {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (!metaButtonClicked) {
			defaultHandleArrows({ k, metaButtonClicked });
			return;
		}
		const lastSelectedCell = $selectedCells[$selectedCells.length - 1];
		if (lastSelectedCell) {
			const { row, column } = lastSelectedCell;
			let dim = editorHistory.getClue('dimensions');
			let newCell: Position | undefined = undefined;
			switch (k.key) {
				case 'ArrowUp':
					if (row !== 0) {
						newCell = { row: row - 1, column };
					} else {
						newCell = { row: 8, column };
					}
					break;
				case 'ArrowRight':
					if (column !== dim.columns - 1) {
						newCell = { row, column: column + 1 };
					} else {
						newCell = { row, column: 0 };
					}
					break;
				case 'ArrowDown':
					if (row !== dim.rows - 1) {
						newCell = { row: row + 1, column };
					} else {
						newCell = { row: 0, column };
					}
					break;
				case 'ArrowLeft':
					if (column !== 0) {
						newCell = { row, column: column - 1 };
					} else {
						newCell = { row, column: 8 };
					}
					break;
				default:
					break;
			}
			if (newCell) {
				k.preventDefault();
				if (isCommandKey(k)) {
					if ($selectedItemIndex > -1) {
						addCellToSelectedPath(newCell);
					} else {
						selectedCells.addCell(newCell);
					}
				} else {
					$selectedCells = [newCell];
					$selectedItemIndex = -1;
				}
			}
		}
	};

	onMount(() => {
		$handleMouseDown = customHandleMouseDown;

		$handleMouseEnter = customHandleMouseEnter;

		$handleArrows = customHandleArrows;
	});

	function handleKeyDown(k: KeyboardEvent): void {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (isDeleteKey(k)) {
			if ($selectedItemIndex !== undefined) {
				deletePathAtIndex($selectedItemIndex);
			} else {
				editorHistory.clearCells(get(selectedCells));
			}
		} else if (k.key === 'Enter') {
			newPathFromSelection();
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="grid grid-cols-2 w-full h-full p-2">
	<div class="px-2 flex flex-col overflow-hidden justify-between">
		<div
			class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
		>
			<div class="h-full overflow-y-auto w-full">
				{#each $sudokuClues.paths as path, index (index)}
					<ControllerButton
						isHighlighted={index === $selectedItemIndex}
						onClick={() => {
							selectedCells.set(path.positions);
							$selectedItemIndex = index;
						}}
						onDelete={() => deletePathAtIndex(index)}
						onHover={() => {
							$highlightedCells = path.positions;
							$highlightedItemIndex = index;
						}}
						onHoverOut={() => {
							$highlightedCells = [];
							$highlightedItemIndex = -1;
						}}
						onMoveUp={() => reorderPath(index, 'up')}
						onMoveDown={() => reorderPath(index, 'down')}
					>
						<ScaledSvg>
							<PathComponent {path} />
						</ScaledSvg>
					</ControllerButton>
				{/each}
			</div>
		</div>

		<Button
			variant="secondary"
			class="w-full"
			disabled={$selectedCells.length === 0}
			on:click={newPathFromSelection}
		>
			New path from selection
		</Button>
	</div>
	<div class="px-2 flex flex-col">
		<div>
			<Select onChange={() => onChangeType()} options={pathTypes} bind:option={type}>
				<svelte:fragment slot="label">Type</svelte:fragment>
				<div slot="option" let:option>
					{pathTypeNames[option]}
				</div>
			</Select>
		</div>

		<div>
			<ColorSelect bind:color class="w-full" />
		</div>

		<div>
			<Label id="pen">Pen</Label>
			<RadioGroup
				options={forms}
				idFromOption={(o) => o}
				let:option
				name="Form"
				bind:value={form}
				onChange={() => updateSelectedPath()}
			>
				<ScaledSvg>
					<PathComponent path={{ positions: [{ row: 0, column: 0 }], color, form: option }} />
				</ScaledSvg>
			</RadioGroup>
		</div>

		<div>
			<Range
				min={1}
				max={100}
				bind:value={width}
				label="Width: {width}%"
				id="width"
				step={1}
				on:change={() => updateSelectedPath()}
			/>
		</div>

		<div class="grid grid-cols-2 grid-rows-1 gap-2">
			<Checkbox bind:checked={hollow} label="Hollow" on:change={() => toggleHollow()} />
			<Checkbox bind:checked={arrow} label="Arrow" on:change={() => toggleArrow()} />
		</div>

		<div>
			<Checkbox
				bind:checked={uniqueDigits}
				label="Unique Digits"
				on:change={() => toggleUniqueDigits()}
			/>
		</div>
	</div>
</div>
