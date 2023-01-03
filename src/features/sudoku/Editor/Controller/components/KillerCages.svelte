<script lang="ts">
	import { cageTypesToLabel } from '$constants';
	import Killercage from '$features/sudoku/components/display/killercages/Killercage.svelte';
	import ScaledSvg from '$features/sudoku/components/display/ScaledSvg.svelte';
	import type { CageType, Extendedcage, Position } from '$models/Sudoku';
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
	import Input from '$ui/Input.svelte';
	import Label from '$ui/Label.svelte';
	import Select from '$ui/Select.svelte';
	import { isDeleteKey } from '$utils/isDeleteKey';
	import isArrowKey from '$utils/keyboard/isArrowKey';
	import { isCommandKey } from '$utils/keyboard/isCommandKey';
	import moveArrayElement from '$utils/moveArrayElement';
	import { cageDefaults } from '$utils/prefabs';
	import { onMount } from 'svelte';

	const sudokuClues = editorHistory.subscribeToClues();
	const labels = editorHistory.labels;

	let type: CageType | 'CUSTOM' = 'Killer';
	let defaultSettings = cageDefaults(type);
	let { text, color, uniqueDigits } = defaultSettings;

	$: color, updateSelectedCage();

	const cageTypes: CageType[] = ['Killer'];
	const cageTypesWithCustom: (CageType | 'CUSTOM')[] = [...cageTypes, 'CUSTOM'];

	const cageTypeNames: Record<CageType | 'CUSTOM', string> = {
		Killer: 'Killer',
		CUSTOM: 'Custom'
	};

	let input: Input;

	$: if ($highlights.selectedItemIndex >= 0 && $highlights.inputMode === 'extendedcages') {
		cageSelected($highlights.selectedItemIndex);
	}

	function cageSelected(selectedItemIndex: number): void {
		updateSettings($sudokuClues.extendedcages[selectedItemIndex]);
	}

	function updateSettings(cage: Partial<Extendedcage>) {
		type = cage.type ?? 'CUSTOM';
		defaultSettings = cageDefaults(type);
		text = cage.text ?? defaultSettings.text;
		color = cage.color ?? defaultSettings.color;
		uniqueDigits = cage.uniqueDigits ?? defaultSettings.uniqueDigits;
	}

	$: type, changeType(type);
	function changeType(type: CageType | 'CUSTOM') {
		updateSettings(type !== 'CUSTOM' ? { type } : {});
		updateSelectedCage();
	}

	function toggleUniqueDigits(): void {
		uniqueDigits = !uniqueDigits;

		updateSelectedCage();
	}

	function newCage(positions: Position[]): Extendedcage {
		return {
			positions,
			type: type !== 'CUSTOM' ? type : undefined,
			text: text != defaultSettings.text ? text : undefined,
			color: color != defaultSettings.color ? color : undefined,
			uniqueDigits: uniqueDigits != defaultSettings.uniqueDigits ? uniqueDigits : undefined
		};
	}

	const updateSelectedCage = (): void => {
		if ($highlights.selectedItemIndex === -1) return;

		let newCages: Extendedcage[] = [];
		$sudokuClues.extendedcages.forEach((cage: Extendedcage, i: number) => {
			if (i !== $highlights.selectedItemIndex) {
				newCages = [...newCages, cage];
			} else {
				newCages = [...newCages, newCage(cage.positions)];

				if (type !== cage.type) {
					addLabel();
				}
			}
		});
		editorHistory.set({ extendedcages: newCages });
	};

	function newKillerCageFromSelection(): void {
		if ($highlights.selectedCells.length > 0) {
			const newCages = [...$sudokuClues.extendedcages, newCage($highlights.selectedCells)];

			editorHistory.set({ extendedcages: newCages });
			highlights.set({ selectedItemIndex: newCages.length - 1 });

			addLabel();
		}
	}

	function addLabel() {
		if (type !== 'CUSTOM') {
			const label = $labels.find((l) => l.label.name === cageTypesToLabel[type as CageType]);
			if (label) {
				label.selected = true;
			}
		}
	}

	const deleteKillerCageAtIndex = (index: number): void => {
		const newCages = $sudokuClues.extendedcages.filter((_, i) => index !== i);
		highlights.reset();
		editorHistory.set({ extendedcages: newCages });
	};

	function handleKeyDown(k: KeyboardEvent): void {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (!isArrowKey(k.key)) {
			input.focus();
		}

		if (isDeleteKey(k) && text === '') {
			if ($highlights.selectedItemIndex !== undefined) {
				deleteKillerCageAtIndex($highlights.selectedItemIndex);
			} else {
				editorHistory.clearCells($highlights.selectedCells);
			}
		} else if (k.key === 'Enter') {
			newKillerCageFromSelection();
		}
	}

	function addCellToSelectedKillerCage(cell: Position, keep = true): void {
		const newCages: Extendedcage[] = [];
		const selectedCageIndex = $highlights.selectedItemIndex;
		let removed = false;

		$sudokuClues.extendedcages.forEach((cage, i) => {
			if (i === selectedCageIndex) {
				let found = false;
				let newPositions = cage.positions.filter((c) => {
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
					newCages.push({ ...cage, positions: newPositions });
				} else {
					removed = true;
				}
			} else {
				newCages.push(cage);
			}
		});
		editorHistory.set({ extendedcages: newCages });
		if (!removed) {
			highlights.set({
				selectedCells: newCages[selectedCageIndex].positions,
				selectedItemIndex: selectedCageIndex
			});
		} else {
			highlights.set({ selectedCells: [] });
		}
	}

	const customHandleMouseDown: MouseDownHandler = ({ cell, metaButtonClicked }) => {
		if (!metaButtonClicked) {
			highlights.set({ selectedCells: [cell] });
		} else {
			if ($highlights.selectedItemIndex > -1) {
				addCellToSelectedKillerCage(cell, false);
			} else {
				highlights.addSelectedCell(cell);
			}
		}
	};

	const customHandleMouseEnter: MouseEnterHandler = ({ cell, mouseDown }) => {
		if (!mouseDown) return;

		if ($highlights.selectedItemIndex === -1) {
			highlights.addSelectedCell(cell);
		} else {
			if ($highlights.selectedCells.length > 0) {
				addCellToSelectedKillerCage(cell);
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
		let lastSelectedCell = $highlights.selectedCells[$highlights.selectedCells.length - 1];
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
					if ($highlights.selectedItemIndex > -1) {
						addCellToSelectedKillerCage(newCell);
					} else {
						highlights.addSelectedCell(newCell);
					}
				} else {
					highlights.set({ selectedCells: [newCell], selectedItemIndex: -1 });
				}
			}
		}
	};

	const reorderKillerCage = (index: number, way: 'up' | 'down'): void => {
		let newCages: Extendedcage[] = [];
		if (way === 'up') {
			if (index === 0) return;
			newCages = moveArrayElement($sudokuClues.extendedcages, index, index - 1);
			if (index === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex - 1 });
			} else if (index - 1 === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex + 1 });
			}
		} else if (way === 'down') {
			if (index === $sudokuClues.extendedcages.length - 1) return;
			newCages = moveArrayElement($sudokuClues.extendedcages, index, index + 1);
			if (index === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex + 1 });
			} else if (index + 1 === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex - 1 });
			}
		}
		editorHistory.set({ extendedcages: newCages });
	};

	onMount(() => {
		$handleMouseDown = customHandleMouseDown;

		$handleMouseEnter = customHandleMouseEnter;

		$handleArrows = customHandleArrows;
	});
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="grid grid-cols-2 w-full h-full p-2">
	<div class="px-2 flex flex-col gap-1 overflow-hidden justify-between">
		<div
			class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
		>
			<div class="h-full overflow-y-auto w-full">
				{#each $sudokuClues.extendedcages as cage, index}
					<ControllerButton
						onHover={() => {
							highlights.set({ highlightedCells: cage.positions, highlightedItemIndex: index });
						}}
						onHoverOut={() => {
							highlights.set({ highlightedCells: [], highlightedItemIndex: -1 });
						}}
						isHighlighted={index === $highlights.selectedItemIndex}
						onClick={() => {
							highlights.set({ selectedCells: cage.positions, selectedItemIndex: index });
						}}
						onDelete={() => deleteKillerCageAtIndex(index)}
						onMoveUp={() => reorderKillerCage(index, 'up')}
						onMoveDown={() => reorderKillerCage(index, 'down')}
					>
						<ScaledSvg>
							<Killercage {cage} dimensions={$sudokuClues.dimensions} />
						</ScaledSvg>
					</ControllerButton>
				{/each}
			</div>
		</div>

		<Button
			variant="secondary"
			on:click={() => newKillerCageFromSelection()}
			class="w-full"
			disabled={$highlights.selectedCells.length < 1}
		>
			New Cage From Selection
		</Button>
	</div>

	<div class="px-2 flex flex-col">
		<div>
			<Select options={cageTypesWithCustom} bind:option={type}>
				<svelte:fragment slot="label">Type</svelte:fragment>
				<div slot="option" let:option class="capitalize">
					{cageTypeNames[option]}
				</div>
			</Select>
		</div>
		<div>
			<ColorSelect bind:color class="w-full" />
		</div>
		<div>
			<Label id="text">Text</Label>
			<Input
				bind:this={input}
				maxlength={20}
				placeholder="Text"
				bind:value={text}
				autocomplete="off"
				name="text"
				id="text"
				on:input={() => updateSelectedCage()}
				on:focus={() => {
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					$handleArrows = () => {};
				}}
				on:blur={() => {
					$handleArrows = defaultHandleArrows;
				}}
			/>
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
