<script lang="ts">
  import {
    cellClueLocationNames,
    cellClueSizeNames,
    cellClueTypeNames,
    cellClueTypesToLabel,
    isFrameCellClue,
    rotationNames,
    symbolTypeNames
  } from '$constants';
  import type {
    Cellclue,
    CellClueLocation,
    CellClueSize,
    CellClueType,
    Position,
    Rotation,
    SymbolType
  } from '@octopuzzles/models';
  import { hasOpenModals, Button, ControllerButton, Input, Label, Select } from '@octopuzzles/ui';
  import { editorHistory, handleArrows, highlights, setMargins } from '$stores/sudokuStore';
  import { defaultHandleArrows } from '$stores/sudokuStore/interactionHandlers';
  import ColorSelect from '$components/ColorSelect.svelte';
  import { deepCopy, isDeleteKey, isArrowKey, moveArrayElement } from '@octopuzzles/utils';
  import { cellClueDefaults } from '@octopuzzles/sudoku-utils';
  import { onDestroy } from 'svelte';

  const { selectedItemIndex, selectedCells, highlightedCells, highlightedItemIndex } = highlights;
  const labels = editorHistory.labels;
  const sudokuClues = editorHistory.subscribeToClues();

  let type: CellClueType | 'CUSTOM' = $sudokuClues.cellclues[0]?.type ?? 'CUSTOM';
  let defaultSettings = cellClueDefaults(type);
  let { location, text, size, symbol, rotation, color } = defaultSettings;

  $: color, updateSelectedClue();

  let input: Input;

  const cellClueTypes: (CellClueType | 'CUSTOM')[] = [
    'Maximum',
    'Minimum',
    'LittleKillerNE',
    'LittleKillerNW',
    'LittleKillerSE',
    'LittleKillerSW',
    'Sandwich',
    'Skyscraper',
    'XSum',
    'NumberedRoom',
    'CUSTOM'
  ];

  const symbolTypes: (SymbolType | 'NONE')[] = [
    'Diagonal',
    'Arrow',
    'SmallArrow',
    'Arrowhead',
    'InvertedArrowhead',
    'NONE'
  ];

  const cellClueLocations: CellClueLocation[] = [
    'TopLeft',
    'Top',
    'TopRight',
    'Left',
    'Center',
    'Right',
    'BottomLeft',
    'Bottom',
    'BottomRight'
  ];

  const cellClueSizes: CellClueSize[] = ['Large', 'Medium', 'Small', 'XSmall'];

  const symbolRotations: Rotation[] = [
    'NorthWest',
    'North',
    'NorthEast',
    'East',
    'SouthEast',
    'South',
    'SouthWest',
    'West'
  ];

  $: if ($selectedItemIndex >= 0) {
    cellClueSelected($selectedItemIndex);
  }

  function cellClueSelected(selectedItemIndex: number): void {
    updateSettings($sudokuClues.cellclues[selectedItemIndex]);
  }

  function updateSettings(clue: Partial<Cellclue>) {
    type = clue.type ?? 'CUSTOM';
    defaultSettings = cellClueDefaults(type);
    text = clue.text ?? defaultSettings.text;
    location = clue.location ?? defaultSettings.location;
    size = clue.size ?? defaultSettings.size;
    symbol = clue.symbol ?? defaultSettings.symbol;
    rotation = clue.rotation ?? defaultSettings.rotation;
    color = clue.color ?? defaultSettings.color;
  }

  function changeType(type: CellClueType | 'CUSTOM') {
    if (type !== 'CUSTOM' && isFrameCellClue[type]) {
      setMargins({
        left: Math.max(1, $sudokuClues.dimensions.margins?.left ?? 0),
        right: Math.max(1, $sudokuClues.dimensions.margins?.right ?? 0),
        top: Math.max(1, $sudokuClues.dimensions.margins?.top ?? 0),
        bottom: Math.max(1, $sudokuClues.dimensions.margins?.bottom ?? 0)
      });
    } else {
      resetMargins();
    }

    updateSettings(type !== 'CUSTOM' ? { type } : {});

    updateSelectedClue();
  }

  function resetMargins() {
    setMargins({
      left: Math.max(
        $sudokuClues.cellclues.some(
          (clue) => clue.position.column < ($sudokuClues.dimensions.margins?.left ?? 0)
        )
          ? 1
          : 0,
        $sudokuClues.dimensions.margins?.left ?? 0
      ),
      right: Math.max(
        $sudokuClues.cellclues.some(
          (clue) =>
            clue.position.column >=
            $sudokuClues.dimensions.columns - ($sudokuClues.dimensions.margins?.right ?? 0)
        )
          ? 1
          : 0,
        $sudokuClues.dimensions.margins?.right ?? 0
      ),
      top: Math.max(
        $sudokuClues.cellclues.some(
          (clue) => clue.position.row < ($sudokuClues.dimensions.margins?.top ?? 0)
        )
          ? 1
          : 0,
        $sudokuClues.dimensions.margins?.top ?? 0
      ),
      bottom: Math.max(
        $sudokuClues.cellclues.some(
          (clue) =>
            clue.position.row >=
            $sudokuClues.dimensions.rows - ($sudokuClues.dimensions.margins?.bottom ?? 0)
        )
          ? 1
          : 0,
        $sudokuClues.dimensions.margins?.bottom ?? 0
      )
    });
  }

  $: canMakeNewCellClue = $selectedCells.length === 1;

  function newCellClue(position: Position): Cellclue {
    return {
      position,
      type: type !== 'CUSTOM' ? type : undefined,
      text:
        symbol === 'NONE' && (type === 'CUSTOM' || text != defaultSettings.text) ? text : undefined,
      location:
        symbol === 'NONE' && (type === 'CUSTOM' || location !== defaultSettings.location)
          ? location
          : undefined,
      size:
        symbol === 'NONE' && (type === 'CUSTOM' || size != defaultSettings.size) ? size : undefined,
      symbol:
        (type === 'CUSTOM' || symbol !== defaultSettings.symbol) && symbol != 'NONE'
          ? symbol
          : undefined,
      rotation:
        symbol !== 'NONE' && (type === 'CUSTOM' || rotation !== defaultSettings.rotation)
          ? rotation
          : undefined,
      color: type === 'CUSTOM' || color !== defaultSettings.color ? color : undefined
    };
  }

  const createNewCellClue = (): void => {
    if ($selectedCells.length > 1) return;
    editorHistory.set({
      cellclues: [...deepCopy($sudokuClues.cellclues), newCellClue($selectedCells[0])]
    });
    $selectedItemIndex = $sudokuClues.cellclues.length - 1;

    addLabel();
  };

  function addLabel() {
    if (type !== 'CUSTOM') {
      const label = $labels.find(
        (l) => l.label.name === cellClueTypesToLabel[type as CellClueType]
      );
      if (label) {
        label.selected = true;
      }
    }
  }

  const updateSelectedClue = (): void => {
    if ($selectedItemIndex === -1) return;

    let newCellClues: Cellclue[] = [];
    $sudokuClues.cellclues.forEach((cellClue, i) => {
      if (i !== $selectedItemIndex) {
        newCellClues = [...newCellClues, cellClue];
      } else {
        newCellClues = [...newCellClues, newCellClue(cellClue.position)];

        if (type !== cellClue.type) {
          addLabel();
        }
      }
    });
    editorHistory.set({ cellclues: newCellClues });
  };

  const deleteCellClueAtIndex = (index: number): void => {
    const newCellClues = $sudokuClues.cellclues.filter((_, i) => index !== i);
    $selectedCells = [];
    $highlightedCells = [];
    $selectedItemIndex = -1;
    editorHistory.set({ cellclues: newCellClues });
  };

  function handleKeyDown(k: KeyboardEvent): void {
    //do not accept keyboard input when any modal controls are open
    if (hasOpenModals()) return;

    if (!isArrowKey(k)) {
      input.focus();
    }

    if (isDeleteKey(k) && $selectedItemIndex >= 0 && text === '') {
      // The input needs to handle backspace on empty input-field as well
      deleteCellClueAtIndex($selectedItemIndex);
    }

    if (k.key === 'Enter') {
      createNewCellClue();
    }
  }

  const reorderCellClue = (index: number, way: 'up' | 'down'): void => {
    let newCellClues: Cellclue[] = [];
    if (way === 'up') {
      if (index === 0) return;
      newCellClues = moveArrayElement($sudokuClues.cellclues, index, index - 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex--;
      } else if (index - 1 === $selectedItemIndex) {
        $selectedItemIndex++;
      }
    } else if (way === 'down') {
      if (index === $sudokuClues.cellclues.length - 1) return;
      newCellClues = moveArrayElement($sudokuClues.cellclues, index, index + 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex++;
      } else if (index + 1 === $selectedItemIndex) {
        $selectedItemIndex--;
      }
    }
    editorHistory.set({ cellclues: newCellClues });
  };

  onDestroy(() => {
    resetMargins();
  });
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="grid grid-cols-2 w-full h-full p-2">
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <div
      class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
    >
      <div class="h-full overflow-y-auto w-full">
        {#each $sudokuClues.cellclues as cellClue, index (index)}
          <ControllerButton
            isHighlighted={index === $selectedItemIndex}
            onClick={() => {
              $selectedCells = [cellClue.position];
              $selectedItemIndex = index;
            }}
            onDelete={() => deleteCellClueAtIndex(index)}
            onHover={() => {
              $highlightedCells = [cellClue.position];
              $highlightedItemIndex = index;
            }}
            onHoverOut={() => {
              $highlightedCells = [];
              $highlightedItemIndex = -1;
            }}
            onMoveDown={() => reorderCellClue(index, 'down')}
            onMoveUp={() => reorderCellClue(index, 'up')}
          >
            {cellClue.type ? cellClueTypeNames[cellClue.type] : 'Custom'}
          </ControllerButton>
        {/each}
      </div>
    </div>

    <Button
      variant="secondary"
      class="w-full"
      disabled={!canMakeNewCellClue}
      on:click={createNewCellClue}
    >
      <span class="text-sm">New Cell clue from selection</span>
    </Button>
  </div>

  <div class="px-2 flex flex-col">
    <div>
      <Select onChange={() => changeType(type)} options={cellClueTypes} bind:option={type}>
        <svelte:fragment slot="label">Type</svelte:fragment>
        <div slot="option" let:option>
          {cellClueTypeNames[option]}
        </div>
      </Select>
    </div>
    <div>
      <ColorSelect bind:color class="w-full" />
    </div>
    <div>
      <Select onChange={() => updateSelectedClue()} options={symbolTypes} bind:option={symbol}>
        <svelte:fragment slot="label">Symbol</svelte:fragment>
        <div slot="option" let:option>
          {symbolTypeNames[option]}
        </div>
      </Select>
    </div>
    {#if symbol.toString() == 'NONE'}
      <div>
        <Label id="value">Value</Label>
        <Input
          bind:this={input}
          maxlength={4}
          placeholder="Text"
          bind:value={text}
          autocomplete="off"
          name="text"
          id="text"
          on:input={() => updateSelectedClue()}
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
        <Select
          onChange={() => updateSelectedClue()}
          options={cellClueLocations}
          bind:option={location}
        >
          <svelte:fragment slot="label">Location</svelte:fragment>
          <div slot="option" let:option>
            {cellClueLocationNames[option]}
          </div>
        </Select>
      </div>
      <div>
        <Select onChange={() => updateSelectedClue()} options={cellClueSizes} bind:option={size}>
          <svelte:fragment slot="label">Size</svelte:fragment>
          <div slot="option" let:option>
            {cellClueSizeNames[option]}
          </div>
        </Select>
      </div>
    {/if}
    {#if symbol.toString() != 'NONE'}
      <div>
        <Select
          onChange={() => updateSelectedClue()}
          options={symbolRotations}
          bind:option={rotation}
        >
          <svelte:fragment slot="label">Orientation</svelte:fragment>
          <div slot="option" let:option>
            {rotationNames[option]}
          </div>
        </Select>
      </div>
    {/if}
  </div>
</div>
