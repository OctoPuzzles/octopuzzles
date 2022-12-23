<script lang="ts">
  import Button from '$ui/Button.svelte';
  import Input from '$ui/Input.svelte';
  import Label from '$ui/Label.svelte';
  import ColorSelect from '$ui/ColorSelect.svelte';
  import OldSelect from '$ui/OldSelect.svelte';
  import { cageTypeNames, cageTypesToLabel } from '$constants';
  import CaretUp from 'phosphor-svelte/lib/CaretUp/CaretUp.svelte';
  import CaretDown from 'phosphor-svelte/lib/CaretDown/CaretDown.svelte';
  import Trash from 'phosphor-svelte/lib/Trash/Trash.svelte';
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
  import classNames from 'classnames';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import isArrowKey from '$utils/isArrowKey';
  import { isCommandKey } from '$utils/isCommandKey';
  import { isDeleteKey } from '$utils/isDeleteKey';
  import { cageDefaults } from '$utils/prefabs';
  import moveArrayElement from '$utils/moveArrayElement';
  import type { CageType, Extendedcage, Position } from '$models/Sudoku';
  import { hasOpenModals } from '$stores/modalStore';
  import Checkbox from '$ui/Checkbox.svelte';

  const { selectedItemIndex, selectedCells, highlightedCells, highlightedItemIndex } = highlights;
  const sudokuClues = editorHistory.subscribeToClues();
  const labels = editorHistory.labels;

  let type: CageType | 'CUSTOM' = 'Killer';
  let defaultSettings = cageDefaults(type);
  let { text, color, uniqueDigits } = defaultSettings;

  $: color, updateSelectedCage();

  const cageTypes: CageType[] = ['Killer'];

  let input: Input;

  $: if ($selectedItemIndex >= 0) {
    cageSelected($selectedItemIndex);
  }

  function cageSelected(selectedItemIndex: number): void {
    updateSettings($sudokuClues.cages[selectedItemIndex]);
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
    $sudokuClues.cages.forEach((cage: Extendedcage, i: number) => {
      if (i !== $selectedItemIndex) {
        newCages = [...newCages, cage];
      } else {
        newCages = [...newCages, newCage(cage.positions)];

        if (type !== cage.type) {
          addLabel();
        }
      }
    });
    editorHistory.set({ cages: newCages });
  };

  function newKillerCageFromSelection(): void {
    if ($selectedCells.length > 0) {
      const newCages = [...$sudokuClues.cages, newCage($selectedCells)];

      editorHistory.set({ cages: newCages });
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
    const newCages = $sudokuClues.cages.filter((_, i) => index !== i);
    $selectedCells = [];
    $highlightedCells = [];
    $selectedItemIndex = -1;
    editorHistory.set({ cages: newCages });
  };

  function handleKeyDown(k: KeyboardEvent): void {
    //do not accept keyboard input when any modal controls are open
    if (hasOpenModals()) return;

    if (!isArrowKey(k.key)) {
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

    $sudokuClues.cages.forEach((cage, i) => {
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
    editorHistory.set({ cages: newCages });
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
      newCages = moveArrayElement($sudokuClues.cages, index, index - 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex--;
      } else if (index - 1 === $selectedItemIndex) {
        $selectedItemIndex++;
      }
    } else if (way === 'down') {
      if (index === $sudokuClues.cages.length - 1) return;
      newCages = moveArrayElement($sudokuClues.cages, index, index + 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex++;
      } else if (index + 1 === $selectedItemIndex) {
        $selectedItemIndex--;
      }
    }
    editorHistory.set({ cages: newCages });
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
        {#each $sudokuClues.cages as cage, index}
          <button
            class={classNames(
              'h-12 w-full flex rounded-md bg-white border border-gray-300 font-medium text-gray-700 overflow-hidden mb-2',
              { 'border-blue-500': index === $selectedItemIndex }
            )}
            on:mouseover={() => {
              $highlightedCells = cage.positions;
              $highlightedItemIndex = index;
            }}
            on:focus={() => {
              $highlightedCells = cage.positions;
              $highlightedItemIndex = index;
            }}
            on:mouseout={() => {
              $highlightedCells = [];
              $highlightedItemIndex = -1;
            }}
            on:blur={() => {
              $highlightedCells = [];
              $highlightedItemIndex = -1;
            }}
          >
            <div class="h-full w-8 bg-gray-100 border-r border-gray-300">
              <div
                class="h-1/2 flex justify-center items-center hover:bg-gray-200 p-1 border-b border-gray-300"
                on:click={() => reorderKillerCage(index, 'up')}
              >
                <CaretUp size={32} />
              </div>
              <div
                class="h-1/2 flex justify-center items-center hover:bg-gray-200 p-1"
                on:click={() => reorderKillerCage(index, 'down')}
              >
                <CaretDown size={32} />
              </div>
            </div>
            <span
              class="hover:bg-gray-100 w-full h-full flex items-center justify-center"
              on:click={() => {
                $selectedCells = cage.positions;
                $selectedItemIndex = index;
              }}
            >
              {cage.type ? cageTypeNames[cage.type] : 'Custom'}: <br /> ({cage.positions
                .length}-cell{cage.positions.length > 1 ? 's' : ''})
            </span>
            <div
              class="h-full w-8 p-1 flex justify-center items-center hover:bg-red-100 hover:text-red-500 border-l border-gray-300"
              on:click={() => deleteKillerCageAtIndex(index)}
            >
              <Trash size={20} />
            </div>
          </button>
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
      <OldSelect
        label="Type"
        on:change={() => changeType(type)}
        id="type"
        bind:value={type}
        class="mr-0.5 w-full capitalize"
      >
        {#each cageTypes as cageType}
          <option value={cageType} class="capitalize">{cageTypeNames[cageType]}</option>
        {/each}
        <option value={'CUSTOM'} class="capitalize">Custom</option>
      </OldSelect>
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
