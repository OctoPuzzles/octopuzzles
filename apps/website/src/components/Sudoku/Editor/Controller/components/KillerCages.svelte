<script lang="ts">
  import Killercage from '$components/Sudoku/Display/Clues/killercages/Killercage.svelte';
  import ScaledSvg from '$components/ScaledSvg.svelte';
  import { cageTypeNames, cageTypesToLabel } from '$constants';
  import type { CageType, Extendedcage, Position } from '@octopuzzles/models';
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
  import {
    Button,
    Checkbox,
    ControllerButton,
    Input,
    Label,
    Select,
    hasOpenModals
  } from '@octopuzzles/ui';
  import ColorSelect from '$components/ColorSelect.svelte';
  import { isDeleteKey, isArrowKey, isCommandKey, moveArrayElement } from '@octopuzzles/utils';
  import { cageDefaults } from '@octopuzzles/sudoku-utils';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  const { selectedItemIndex, selectedCells, highlightedCells, highlightedItemIndex } = highlights;
  const sudokuClues = editorHistory.subscribeToClues();
  const labels = editorHistory.labels;

  let type: CageType | 'CUSTOM' = 'Killer';
  let defaultSettings = cageDefaults(type);
  let { text, color, uniqueDigits } = defaultSettings;

  $: color, updateSelectedCage();

  const cageTypes: (CageType | 'CUSTOM')[] = ['Killer', 'CUSTOM'];

  let input: Input;

  $: if ($selectedItemIndex >= 0) {
    cageSelected($selectedItemIndex);
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
    if ($selectedItemIndex === -1) return;

    let newCages: Extendedcage[] = [];
    $sudokuClues.extendedcages.forEach((cage: Extendedcage, i: number) => {
      if (i !== $selectedItemIndex) {
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
    if ($selectedCells.length > 0) {
      const newCages = [...$sudokuClues.extendedcages, newCage($selectedCells)];

      editorHistory.set({ extendedcages: newCages });
      $selectedItemIndex = newCages.length - 1;

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
    $selectedCells = [];
    $highlightedCells = [];
    $selectedItemIndex = -1;
    editorHistory.set({ extendedcages: newCages });
  };

  function handleKeyDown(k: KeyboardEvent): void {
    //do not accept keyboard input when any modal controls are open
    if (hasOpenModals()) return;

    if (!isArrowKey(k)) {
      input.focus();
    }

    if (isDeleteKey(k) && text === '') {
      if ($selectedItemIndex !== undefined) {
        deleteKillerCageAtIndex($selectedItemIndex);
      } else {
        editorHistory.clearCells(get(selectedCells));
      }
    } else if (k.key === 'Enter') {
      newKillerCageFromSelection();
    }
  }

  function addCellToSelectedKillerCage(cell: Position, keep = true): void {
    const newCages: Extendedcage[] = [];
    const selectedCageIndex = $selectedItemIndex;
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
      $selectedCells = newCages[selectedCageIndex].positions;
      $selectedItemIndex = selectedCageIndex;
    } else {
      $selectedCells = [];
    }
  }

  const customHandleMouseDown: MouseDownHandler = ({ cell, metaButtonClicked }) => {
    if (!metaButtonClicked) {
      selectedCells.set([cell]);
    } else {
      if ($selectedItemIndex > -1) {
        addCellToSelectedKillerCage(cell, false);
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
    let lastSelectedCell = $selectedCells[$selectedCells.length - 1];
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
            addCellToSelectedKillerCage(newCell);
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

  const reorderKillerCage = (index: number, way: 'up' | 'down'): void => {
    let newCages: Extendedcage[] = [];
    if (way === 'up') {
      if (index === 0) return;
      newCages = moveArrayElement($sudokuClues.extendedcages, index, index - 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex--;
      } else if (index - 1 === $selectedItemIndex) {
        $selectedItemIndex++;
      }
    } else if (way === 'down') {
      if (index === $sudokuClues.extendedcages.length - 1) return;
      newCages = moveArrayElement($sudokuClues.extendedcages, index, index + 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex++;
      } else if (index + 1 === $selectedItemIndex) {
        $selectedItemIndex--;
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
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <div
      class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
    >
      <div class="h-full overflow-y-auto w-full">
        {#each $sudokuClues.extendedcages as cage, index}
          <ControllerButton
            isHighlighted={index === $selectedItemIndex}
            onClick={() => {
              $selectedCells = cage.positions;
              $selectedItemIndex = index;
            }}
            onDelete={() => deleteKillerCageAtIndex(index)}
            onHover={() => {
              $highlightedCells = cage.positions;
              $highlightedItemIndex = index;
            }}
            onHoverOut={() => {
              $highlightedCells = [];
              $highlightedItemIndex = -1;
            }}
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
      disabled={$selectedCells.length < 1}
    >
      New Cage From Selection
    </Button>
  </div>

  <div class="px-2 flex flex-col">
    <div>
      <Select onChange={() => changeType(type)} options={cageTypes} bind:option={type}>
        <svelte:fragment slot="label">Type</svelte:fragment>
        <div slot="option" let:option>
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
