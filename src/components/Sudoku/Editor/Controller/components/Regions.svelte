<script lang="ts">
  import Button from '$ui/Button.svelte';
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
  import { isCommandKey } from '$utils/isCommandKey';
  import { isDeleteKey } from '$utils/isDeleteKey';
  import deepCopy from '$utils/deepCopy';
  import Checkbox from '$ui/Checkbox.svelte';
  import OldSelect from '$ui/OldSelect.svelte';
  import ColorSelect from '$ui/ColorSelect.svelte';
  import { regionDefaults } from '$utils/prefabs';
  import { regionTypeNames, regionTypesToLabel } from '$constants';
  import moveArrayElement from '$utils/moveArrayElement';
  import type { Position, Region, RegionType } from '$models/Sudoku';
  import { hasOpenModals } from '$stores/modalStore';

  const { selectedItemIndex, selectedCells, highlightedCells, highlightedItemIndex } = highlights;
  const sudokuClues = editorHistory.subscribeToClues();
  const labels = editorHistory.labels;

  let type: RegionType | 'CUSTOM' = 'Normal';
  let defaultSettings = regionDefaults(type);
  let { borders, color, uniqueDigits } = defaultSettings;

  $: color, updateSelectedRegion();

  const regionTypes: RegionType[] = ['Normal', 'Extra', 'Clone', 'MagicSquare'];

  $: if ($selectedItemIndex >= 0) {
    regionSelected($selectedItemIndex);
  }

  function regionSelected(selectedItemIndex: number): void {
    const region = $sudokuClues.regions[selectedItemIndex];
    if (region == null) return;
    updateSettings(region);
  }

  function updateSettings(region: Partial<Region>) {
    type = region.type ?? 'CUSTOM';
    defaultSettings = regionDefaults(type);
    borders = region.borders ?? defaultSettings.borders;
    color = region.color ?? defaultSettings.color;
    uniqueDigits = region.uniqueDigits ?? defaultSettings.uniqueDigits;
  }

  function changeType(type: RegionType | 'CUSTOM') {
    updateSettings(type !== 'CUSTOM' ? { type } : {});
    updateSelectedRegion();
  }

  function toggleBorders(): void {
    borders = !borders;

    updateSelectedRegion();
  }

  function toggleUniqueDigits(): void {
    uniqueDigits = !uniqueDigits;

    updateSelectedRegion();
  }

  function updateSelectedRegion(): void {
    if ($selectedItemIndex === -1) return;

    let newRegions: Region[] = [];
    $sudokuClues.regions.forEach((region, i) => {
      if (i !== $selectedItemIndex) {
        newRegions = [...newRegions, region];
      } else {
        newRegions = [...newRegions, newRegion(region.positions)];

        if (type !== region.type) {
          addLabel();
        }
      }
    });
    editorHistory.set({ regions: newRegions });
  }

  function newRegion(positions: Position[]): Region {
    return {
      positions,
      type: type !== 'CUSTOM' ? type : undefined,
      borders: borders != defaultSettings.borders ? borders : undefined,
      color:
        (type === 'CUSTOM' || color != defaultSettings.color) && color !== 'NONE'
          ? color
          : undefined,
      uniqueDigits: uniqueDigits != defaultSettings.uniqueDigits ? uniqueDigits : undefined
    };
  }

  function newRegionFromSelection(): void {
    if ($selectedCells.length > 0) {
      const newRegions: Region[] = type !== 'Normal' ? deepCopy($sudokuClues.regions) : [];
      if (type === 'Normal') {
        $sudokuClues.regions.forEach((region) => {
          if (region.type === 'Normal') {
            let newRegion = {
              ...region,
              positions: region.positions.filter(
                (c) => !$selectedCells.some((s) => s.row === c.row && s.column === c.column)
              )
            };
            if (newRegion.positions.length) {
              newRegions.push(newRegion);
            }
          } else {
            newRegions.push(region);
          }
        });
      }

      newRegions.push(newRegion(deepCopy($selectedCells)));
      editorHistory.set({ regions: newRegions });
      $selectedItemIndex = newRegions.length - 1;

      addLabel();
    }
  }

  function addLabel() {
    if (type !== 'CUSTOM') {
      const label = $labels.find((l) => l.label.name === regionTypesToLabel[type as RegionType]);
      if (label) {
        label.selected = true;
      }
    }
  }

  const deleteRegionAtIndex = (index: number): void => {
    const newRegions = $sudokuClues.regions.filter((_, i) => index !== i);
    $selectedCells = [];
    $highlightedCells = [];
    $selectedItemIndex = -1;
    editorHistory.set({ regions: newRegions });
  };

  function handleKeyDown(k: KeyboardEvent): void {
    //do not accept keyboard input when any modal controls are open
    if (hasOpenModals()) return;

    if (isDeleteKey(k)) {
      if ($selectedItemIndex !== undefined) {
        deleteRegionAtIndex($selectedItemIndex);
      } else {
        editorHistory.clearCells(get(selectedCells));
      }
    } else if (k.key === 'Enter') {
      newRegionFromSelection();
    }
  }

  function addCellToSelectedRegion(cell: Position, keep = true): void {
    const newRegions: Region[] = [];
    let selectedRegionIndex = $selectedItemIndex;
    let removed = false;

    $sudokuClues.regions.forEach((region, i) => {
      if (i === $selectedItemIndex) {
        let found = false;
        let newRegion = {
          ...region,
          positions: region.positions.filter((c) => {
            if (c.row === cell.row && c.column === cell.column) {
              found = true;
              return keep;
            }
            return true;
          })
        };
        if (!found) {
          newRegion.positions = [...newRegion.positions, cell];
        }
        if (newRegion.positions.length > 0) {
          newRegions.push(newRegion);
        } else {
          removed = true;
        }
      } else if (type === 'Normal' && region.type === 'Normal') {
        let newRegion = {
          ...region,
          positions: region.positions.filter((c) => {
            if (c.row === cell.row && c.column === cell.column) {
              return false;
            }
            return true;
          })
        };
        if (newRegion.positions.length) {
          newRegions.push(newRegion);
        } else if (i < selectedRegionIndex) {
          --selectedRegionIndex;
        }
      } else {
        newRegions.push(region);
      }
    });
    editorHistory.set({ regions: newRegions });
    if (!removed) {
      $selectedCells = newRegions[selectedRegionIndex].positions;
      $selectedItemIndex = selectedRegionIndex;
    } else {
      $selectedCells = [];
    }

    if (type === 'Normal') {
      addLabel();
    }
  }

  const customHandleMouseDown: MouseDownHandler = ({ cell, metaButtonClicked }) => {
    if (!metaButtonClicked) {
      selectedCells.set([cell]);
    } else {
      if ($selectedItemIndex > -1) {
        addCellToSelectedRegion(cell, false);
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
        addCellToSelectedRegion(cell);
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
            addCellToSelectedRegion(newCell);
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

  const reorderRegion = (index: number, way: 'up' | 'down'): void => {
    let newRegions: Region[] = [];
    if (way === 'up') {
      if (index === 0) return;
      newRegions = moveArrayElement($sudokuClues.regions, index, index - 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex--;
      } else if (index - 1 === $selectedItemIndex) {
        $selectedItemIndex++;
      }
    } else if (way === 'down') {
      if (index === $sudokuClues.regions.length - 1) return;
      newRegions = moveArrayElement($sudokuClues.regions, index, index + 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex++;
      } else if (index + 1 === $selectedItemIndex) {
        $selectedItemIndex--;
      }
    }
    editorHistory.set({ regions: newRegions });
  };

  onMount(() => {
    $handleMouseDown = customHandleMouseDown;
    $handleMouseEnter = customHandleMouseEnter;
    $handleArrows = customHandleArrows;
  });
</script>

<svelte:window on:keydown|preventDefault={handleKeyDown} />

<div class="grid grid-cols-2 w-full h-full p-2">
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <div
      class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
    >
      <div class="h-full overflow-y-auto w-full">
        {#each $sudokuClues.regions as region, index}
          <button
            class={classNames(
              'h-12 w-full flex rounded-md bg-white border border-gray-300 font-medium text-gray-700 overflow-hidden mb-2',
              { 'border-blue-500': index === $selectedItemIndex }
            )}
            on:mouseover={() => {
              $highlightedCells = region.positions;
              $highlightedItemIndex = index;
            }}
            on:focus={() => {
              $highlightedCells = region.positions;
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
                on:click={() => reorderRegion(index, 'up')}
              >
                <CaretUp size={16} />
              </div>
              <div
                class="h-1/2 flex justify-center items-center hover:bg-gray-200 p-1"
                on:click={() => reorderRegion(index, 'down')}
              >
                <CaretDown size={16} />
              </div>
            </div>
            <span
              class="hover:bg-gray-100 w-full h-full flex items-center justify-center"
              on:click={() => {
                $selectedCells = region.positions;
                $selectedItemIndex = index;
              }}
            >
              {region.type !== 'Normal'
                ? region.type
                  ? regionTypeNames[region.type]
                  : 'Custom'
                : `Region ${index + 1}`}: <br /> ({region.positions.length}-cell{region.positions
                .length > 1
                ? 's'
                : ''})
            </span>
            <div
              class="h-full w-8 p-1 flex justify-center items-center hover:bg-red-100 hover:text-red-500 border-l border-gray-300"
              on:click={() => deleteRegionAtIndex(index)}
            >
              <Trash size={20} />
            </div>
          </button>
        {/each}
      </div>
    </div>

    <Button
      variant="secondary"
      on:click={() => newRegionFromSelection()}
      class="w-full"
      disabled={$selectedCells.length < 1}
    >
      New Region From Selection
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
        {#each regionTypes as regionType}
          <option value={regionType} class="capitalize">{regionTypeNames[regionType]}</option>
        {/each}
        <option value={'CUSTOM'} class="capitalize">Custom</option>
      </OldSelect>
    </div>
    <div>
      <ColorSelect bind:color class="w-full" />
    </div>

    <div>
      <Checkbox bind:checked={borders} label="Borders" on:change={() => toggleBorders()} />
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
