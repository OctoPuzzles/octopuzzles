<script lang="ts">
  import { regionTypeNames, regionTypesToLabel } from '$lib/constants';
  import type { Position, Region, RegionType } from '@octopuzzles/models';
  import type { OnClickCellHandler, OnEnterCellHandler } from '@octopuzzles/sudoku-display';
  import {
    editorHistory,
    handleArrows,
    handleMouseDown,
    handleMouseEnter,
    selectedItemIndex,
    selectedCells,
    highlightedCells,
    highlightedItemIndex
  } from '$lib/sudokuStore';
  import { defaultHandleArrows } from '$lib/sudokuStore/interactionHandlers';
  import { Button, Checkbox, ControllerButton, Select, ColorSelect } from '@octopuzzles/ui';
  import {
    isCommandKey,
    isDeleteKey,
    moveArrayElement,
    deepCopy,
    type ArrowDirection
  } from '@octopuzzles/utils';
  import { regionDefaults } from '@octopuzzles/sudoku-utils';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { addLabel } from '$lib/utils/addLabel';
  import { editorAction } from '$lib/editorAction';

  const sudokuClues = editorHistory.subscribeToClues();

  let type: RegionType | 'CUSTOM' = 'Normal';
  let defaultSettings = regionDefaults(type);
  let { borders, color, uniqueDigits, nonStandard } = defaultSettings;

  $: color, updateSelectedRegion();

  const regionTypes: (RegionType | 'CUSTOM')[] = [
    'Normal',
    'Extra',
    'Clone',
    'MagicSquare',
    'CUSTOM'
  ];

  $: if ($selectedItemIndex >= 0) {
    regionSelected($selectedItemIndex);
  }

  function regionSelected(selectedItemIndex: number): void {
    const region = $sudokuClues.regions[selectedItemIndex];
    if (region == null) return;
    updateSettings(region);
  }

  function updateSettings(region: Partial<Region>): void {
    type = region.type ?? 'CUSTOM';
    defaultSettings = regionDefaults(type);
    borders = region.borders ?? defaultSettings.borders;
    color = region.color ?? defaultSettings.color;
    uniqueDigits = region.uniqueDigits ?? defaultSettings.uniqueDigits;
    nonStandard = region.nonStandard ?? defaultSettings.nonStandard;
  }

  function changeType(type: RegionType | 'CUSTOM'): void {
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

  function toggleNonStandard(): void {
    nonStandard = !nonStandard;
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

        if (type !== region.type && type !== 'CUSTOM') {
          addLabel(regionTypesToLabel[type as RegionType]);
        }
      }
    });
    editorHistory.set({ regions: newRegions });
  }

  function newRegion(positions: Position[]): Region {
    return {
      positions,
      type: type !== 'CUSTOM' ? type : undefined,
      borders: borders !== defaultSettings.borders ? borders : undefined,
      color:
        (type === 'CUSTOM' || color !== defaultSettings.color) && color !== 'NONE'
          ? color
          : undefined,
      uniqueDigits: uniqueDigits !== defaultSettings.uniqueDigits ? uniqueDigits : undefined
    };
  }

  function newRegionFromSelection(): void {
    if ($selectedCells.length > 0) {
      const newRegions: Region[] = type !== 'Normal' ? deepCopy($sudokuClues.regions) : [];
      if (type === 'Normal') {
        $sudokuClues.regions.forEach((region) => {
          if (region.type === 'Normal') {
            const newRegion = {
              ...region,
              positions: region.positions.filter(
                (c) => !$selectedCells.some((s) => s.row === c.row && s.column === c.column)
              )
            };
            if (newRegion.positions.length > 0) {
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

      if (type !== 'CUSTOM') {
        addLabel(regionTypesToLabel[type as RegionType]);
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
    if (isDeleteKey(k)) {
      if ($selectedItemIndex != null) {
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
        const newRegion = {
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
        const newRegion = {
          ...region,
          positions: region.positions.filter((c) => {
            if (c.row === cell.row && c.column === cell.column) {
              return false;
            }
            return true;
          })
        };
        if (newRegion.positions.length > 0) {
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
      addLabel(regionTypesToLabel['Normal']);
    }
  }

  const customHandleMouseDown: OnClickCellHandler = (cell, metaButtonClicked) => {
    if (!metaButtonClicked) {
      selectedCells.set([cell]);
    } else {
      if ($selectedItemIndex > -1) {
        addCellToSelectedRegion(cell, false);
      } else {
        selectedCells.add(cell);
      }
    }
  };

  const customHandleMouseEnter: OnEnterCellHandler = (cell) => {
    if ($selectedItemIndex === -1) {
      selectedCells.add(cell);
    } else {
      if ($selectedCells.length > 0) {
        addCellToSelectedRegion(cell);
      }
    }
  };

  const customHandleArrows = (direction: ArrowDirection, k: KeyboardEvent): void => {
    if (!isCommandKey(k)) {
      defaultHandleArrows(direction, k);
      return;
    }
    const lastSelectedCell = $selectedCells[$selectedCells.length - 1];
    if (lastSelectedCell != null) {
      const { row, column } = lastSelectedCell;
      const dim = $sudokuClues.dimensions;
      let newCell: Position | undefined = undefined;
      switch (direction) {
        case 'up':
          if (row !== 0) {
            newCell = { row: row - 1, column };
          } else {
            newCell = { row: 8, column };
          }
          break;
        case 'right':
          if (column !== dim.columns - 1) {
            newCell = { row, column: column + 1 };
          } else {
            newCell = { row, column: 0 };
          }
          break;
        case 'down':
          if (row !== dim.rows - 1) {
            newCell = { row: row + 1, column };
          } else {
            newCell = { row: 0, column };
          }
          break;
        case 'left':
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
            selectedCells.add(newCell);
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

<svelte:window
  use:editorAction={{
    onKeyDown: (k) => {
      k.preventDefault();
      handleKeyDown(k);
    }
  }}
/>

<div class="grid grid-cols-2 w-full h-full p-2">
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <div
      class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
    >
      <div class="h-full overflow-y-auto w-full">
        {#each $sudokuClues.regions as region, index}
          <ControllerButton
            isHighlighted={index === $selectedItemIndex}
            onClick={() => {
              $selectedCells = region.positions;
              $selectedItemIndex = index;
            }}
            onDelete={() => deleteRegionAtIndex(index)}
            onHover={() => {
              $highlightedCells = region.positions;
              $highlightedItemIndex = index;
            }}
            onHoverOut={() => {
              $highlightedCells = [];
              $highlightedItemIndex = -1;
            }}
            onMoveUp={() => reorderRegion(index, 'up')}
            onMoveDown={() => reorderRegion(index, 'down')}
          >
            {#if region.type === 'Normal'}
              Region {index + 1}: <br /> ({region.positions.length}-cell{region.positions.length > 1
                ? 's'
                : ''})
            {:else}
              {region.type != null ? regionTypeNames[region.type] : 'Custom'}
            {/if}
          </ControllerButton>
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
      <Select onChange={() => changeType(type)} options={regionTypes} bind:option={type}>
        <svelte:fragment slot="label">Type</svelte:fragment>
        <div slot="option" let:option>
          {regionTypeNames[option]}
        </div>
      </Select>
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

    {#if type !== 'CUSTOM'}
      <div>
        <Checkbox
          bind:checked={nonStandard}
          label="Non-Standard logic"
          on:change={() => toggleNonStandard()}
        />
      </div>
    {/if}
  </div>
</div>
