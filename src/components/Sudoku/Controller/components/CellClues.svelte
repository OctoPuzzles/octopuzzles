<script lang="ts">
  import Button from '$ui/Button.svelte';
  import Input from '$ui/Input.svelte';
  import Label from '$ui/Label.svelte';
  import ColorSelect from '$ui/ColorSelect.svelte';
  import OldSelect from '$ui/OldSelect.svelte';
  import {
    cellClueLocationNames,
    cellClueSizeNames,
    cellClueTypeNames,
    cellClueTypesToLabel,
    isFrameCellClue,
    rotationNames,
    symbolTypeNames
  } from '$constants';
  import CaretUp from 'phosphor-svelte/lib/CaretUp/CaretUp.svelte';
  import CaretDown from 'phosphor-svelte/lib/CaretDown/CaretDown.svelte';
  import Trash from 'phosphor-svelte/lib/Trash/Trash.svelte';
  import {
    editorHistory,
    handleArrows,
    highlightedCells,
    highlightedItemIndex,
    selectedCells,
    selectedItemIndex,
    setMargins,
    labels
  } from '$stores/sudokuStore';
  import deepCopy from '$utils/deepCopy';
  import isArrowKey from '$utils/isArrowKey';
  import moveArrayElement from '$utils/moveArrayElement';
  import classNames from 'classnames';
  import { defaultHandleArrows } from '$stores/sudokuStore/interactionHandlers';
  import { isDeleteKey } from '$utils/isDeleteKey';
  import { cellClueDefaults } from '$utils/prefabs/cellclues';
  import { onDestroy } from 'svelte';
  import type {
    Cellclue,
    CellClueLocation,
    CellClueSize,
    CellClueType,
    Position,
    Rotation,
    SymbolType
  } from '$models/Sudoku';
  import { hasOpenModals } from '$stores/modalStore';

  let cellClues = editorHistory.getClue('cellclues');
  let dimensions = editorHistory.getClue('dimensions');
  const margins = $dimensions.margins;

  let type: CellClueType | 'CUSTOM' = $cellClues[0]?.type ?? 'CUSTOM';
  let defaultSettings = cellClueDefaults(type);
  let { location, text, size, symbol, rotation, color } = defaultSettings;

  $: color, updateSelectedClue();

  let input: Input;

  const cellClueTypes: CellClueType[] = [
    'Maximum',
    'Minimum',
    'LittleKillerNE',
    'LittleKillerNW',
    'LittleKillerSE',
    'LittleKillerSW',
    'Sandwich',
    'Skyscraper',
    'XSum',
    'NumberedRoom'
  ];

  const symbolTypes: SymbolType[] = [
    'Diagonal',
    'Arrow',
    'SmallArrow',
    'Arrowhead',
    'InvertedArrowhead'
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
    updateSettings($cellClues[selectedItemIndex]);
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
        left: Math.max(1, margins?.left ?? 0),
        right: Math.max(1, margins?.right ?? 0),
        top: Math.max(1, margins?.top ?? 0),
        bottom: Math.max(1, margins?.bottom ?? 0)
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
        $cellClues.some((clue) => clue.position.column < ($dimensions.margins?.left ?? 0)) ? 1 : 0,
        margins?.left ?? 0
      ),
      right: Math.max(
        $cellClues.some(
          (clue) => clue.position.column >= $dimensions.columns - ($dimensions.margins?.right ?? 0)
        )
          ? 1
          : 0,
        margins?.right ?? 0
      ),
      top: Math.max(
        $cellClues.some((clue) => clue.position.row < ($dimensions.margins?.top ?? 0)) ? 1 : 0,
        margins?.top ?? 0
      ),
      bottom: Math.max(
        $cellClues.some(
          (clue) => clue.position.row >= $dimensions.rows - ($dimensions.margins?.bottom ?? 0)
        )
          ? 1
          : 0,
        margins?.bottom ?? 0
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
    editorHistory.set({
      cellclues: [...deepCopy($cellClues), newCellClue($selectedCells[0])]
    });
    $selectedItemIndex = $cellClues.length - 1;

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
    $cellClues.forEach((cellClue, i) => {
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
    const newCellClues = $cellClues.filter((_, i) => index !== i);
    $selectedCells = [];
    $highlightedCells = [];
    $selectedItemIndex = -1;
    editorHistory.set({ cellclues: newCellClues });
  };

  function handleKeyDown(k: KeyboardEvent): void {
    //do not accept keyboard input when any modal controls are open
    if (hasOpenModals()) return;

    if (!isArrowKey(k.key)) {
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
      newCellClues = moveArrayElement($cellClues, index, index - 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex--;
      } else if (index - 1 === $selectedItemIndex) {
        $selectedItemIndex++;
      }
    } else if (way === 'down') {
      if (index === $cellClues.length - 1) return;
      newCellClues = moveArrayElement($cellClues, index, index + 1);
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
        {#each $cellClues as cellClue, index (index)}
          <button
            class={classNames(
              'h-12 w-full flex rounded-md bg-white border border-gray-300 font-medium text-gray-700 overflow-hidden mb-2',
              { 'border-blue-500': index === $selectedItemIndex }
            )}
            on:mouseover={() => {
              $highlightedCells = [cellClue.position];
              $highlightedItemIndex = index;
            }}
            on:focus={() => {
              $highlightedCells = [cellClue.position];
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
                on:click={() => reorderCellClue(index, 'up')}
              >
                <CaretUp size={16} />
              </div>
              <div
                class="h-1/2 flex justify-center items-center hover:bg-gray-200 p-1"
                on:click={() => reorderCellClue(index, 'down')}
              >
                <CaretDown size={16} />
              </div>
            </div>
            <span
              class="hover:bg-gray-100 w-full h-full flex items-center justify-center"
              on:click={() => {
                $selectedCells = [cellClue.position];
                $selectedItemIndex = index;
              }}
            >
              {cellClue.type ? cellClueTypeNames[cellClue.type] : 'Custom'}
            </span>
            <div
              class="h-full w-8 p-1 flex justify-center items-center hover:bg-red-100 hover:text-red-500 border-l border-gray-300"
              on:click={() => deleteCellClueAtIndex(index)}
            >
              <Trash size={20} />
            </div>
          </button>
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
      <OldSelect
        label="Type"
        on:change={() => changeType(type)}
        id="type"
        bind:value={type}
        class="mr-0.5 w-full capitalize"
      >
        {#each cellClueTypes as cellClueType}
          <option value={cellClueType} class="capitalize">{cellClueTypeNames[cellClueType]}</option>
        {/each}
        <option value={'CUSTOM'} class="capitalize">Custom</option>
      </OldSelect>
    </div>
    <div>
      <ColorSelect bind:color class="w-full" />
    </div>
    <div>
      <OldSelect
        label="Symbol"
        on:change={updateSelectedClue}
        id="symbol"
        bind:value={symbol}
        class="mr-0.5 w-full capitalize"
      >
        <option value={'NONE'} class="capitalize">Text</option>
        {#each symbolTypes as symbolType}
          <option value={symbolType} class="capitalize">{symbolTypeNames[symbolType]}</option>
        {/each}
      </OldSelect>
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
        <OldSelect
          label="Location"
          on:change={() => updateSelectedClue()}
          id="location"
          bind:value={location}
          class="mr-0.5 w-full capitalize"
        >
          {#each cellClueLocations as cellClueLocation}
            <option value={cellClueLocation} class="capitalize"
              >{cellClueLocationNames[cellClueLocation]}</option
            >
          {/each}
        </OldSelect>
      </div>
      <div>
        <OldSelect
          label="Size"
          on:change={() => updateSelectedClue()}
          id="size"
          bind:value={size}
          class="mr-0.5 w-full capitalize"
        >
          {#each cellClueSizes as cellClueSize}
            <option value={cellClueSize} class="capitalize"
              >{cellClueSizeNames[cellClueSize]}</option
            >
          {/each}
        </OldSelect>
      </div>
    {/if}
    {#if symbol.toString() != 'NONE'}
      <div>
        <OldSelect
          label="Orientation"
          on:change={() => updateSelectedClue()}
          id="rotation"
          bind:value={rotation}
          class="mr-0.5 w-full capitalize"
        >
          {#each symbolRotations as symbolRotation}
            <option value={symbolRotation} class="capitalize"
              >{rotationNames[symbolRotation]}</option
            >
          {/each}
        </OldSelect>
      </div>
    {/if}
  </div>
</div>
