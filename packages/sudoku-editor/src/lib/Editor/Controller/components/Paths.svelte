<script lang="ts">
  import { pathTypeNames, pathTypesToLabel } from '$lib/constants';
  import type { Form, Path, PathType, Position } from '@octopuzzles/models';
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
  import {
    Button,
    Checkbox,
    ControllerButton,
    Label,
    RadioGroup,
    Range,
    Select,
    ColorSelect,
    ScaledSvg
  } from '@octopuzzles/ui';
  import {
    isCommandKey,
    deepCopy,
    isDeleteKey,
    moveArrayElement,
    type ArrowDirection
  } from '@octopuzzles/utils';
  import { pathDefaults } from '@octopuzzles/sudoku-utils';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { Path as PathComponent } from '@octopuzzles/sudoku-display';
  import { addLabel } from '$lib/utils/addLabel';
  import { editorAction } from '$lib/editorAction';

  const sudokuClues = editorHistory.subscribeToClues();

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

  function updateSettings(path: Partial<Path>): void {
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

  function onChangeType(): void {
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

        if (type !== path.type && type !== 'CUSTOM') {
          addLabel(pathTypesToLabel[type as PathType]);
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
      color: type === 'CUSTOM' || color !== defaultSettings.color ? color : undefined,
      width: type === 'CUSTOM' || width !== defaultSettings.width ? width : undefined,
      form: type === 'CUSTOM' || form !== defaultSettings.form ? form : undefined,
      fill: type === 'CUSTOM' || fill !== defaultSettings.fill ? fill : undefined,
      arrow: type === 'CUSTOM' || arrow !== defaultSettings.arrow ? arrow : undefined,
      uniqueDigits:
        type === 'CUSTOM' || uniqueDigits !== defaultSettings.uniqueDigits
          ? uniqueDigits
          : undefined
    };
  }

  function newPathFromSelection(): void {
    if ($selectedCells.length > 0) {
      editorHistory.set({
        paths: [...deepCopy($sudokuClues.paths), newPath(deepCopy($selectedCells))]
      });
      $selectedItemIndex = $sudokuClues.paths.length - 1;

      if (type !== 'CUSTOM') {
        addLabel(pathTypesToLabel[type as PathType]);
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

  const customHandleMouseDown: OnClickCellHandler = (cell, metaButtonClicked) => {
    if (!metaButtonClicked) {
      selectedCells.set([cell]);
    } else {
      if ($selectedItemIndex > -1) {
        addCellToSelectedPath(cell, false);
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
        addCellToSelectedPath(cell);
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
            addCellToSelectedPath(newCell);
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

  onMount(() => {
    $handleMouseDown = customHandleMouseDown;

    $handleMouseEnter = customHandleMouseEnter;

    $handleArrows = customHandleArrows;
  });

  function handleKeyDown(k: KeyboardEvent): void {
    if (isDeleteKey(k)) {
      if ($selectedItemIndex != null) {
        deletePathAtIndex($selectedItemIndex);
      } else {
        editorHistory.clearCells(get(selectedCells));
      }
    } else if (k.key === 'Enter') {
      newPathFromSelection();
    }
  }
</script>

<svelte:window use:editorAction={{ onKeyDown: handleKeyDown }} />

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
      <Label>Width: {width}%</Label>
      <Range
        min={1}
        max={100}
        bind:value={width}
        id="width"
        step={1}
        onChange={() => updateSelectedPath()}
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
