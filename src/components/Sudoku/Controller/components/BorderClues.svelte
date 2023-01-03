<script lang="ts">
  import Button from '$ui/Button.svelte';
  import Input from '$ui/Input.svelte';
  import Label from '$ui/Label.svelte';
  import ColorSelect from '$ui/ColorSelect.svelte';
  import OldSelect from '$ui/OldSelect.svelte';
  import RadioGroup from '$ui/RadioGroup.svelte';
  import { borderClueTypeNames, borderClueTypesToLabel } from '$constants';
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
    labels
  } from '$stores/sudokuStore';
  import deepCopy from '$utils/deepCopy';
  import isArrowKey from '$utils/isArrowKey';
  import moveArrayElement from '$utils/moveArrayElement';
  import classNames from 'classnames';
  import { defaultHandleArrows } from '$stores/sudokuStore/interactionHandlers';
  import { isDeleteKey } from '$utils/isDeleteKey';
  import { borderClueDefaults } from '$utils/constraints/borderclues';
  import Circle from '$icons/shapes/Circle.svelte';
  import Square from '$icons/shapes/Square.svelte';
  import Diamond from '$icons/shapes/Diamond.svelte';
  import Star from '$icons/shapes/Star.svelte';
  import Line from '$icons/shapes/Line.svelte';
  import type { Borderclue, BorderClueType, Position } from '$models/Sudoku';
  import { hasOpenModals } from '$stores/modalStore';

  let borderClues = editorHistory.getClue('borderclues');

  let type: BorderClueType | 'CUSTOM' = $borderClues[0]?.type ?? 'CUSTOM';
  let defaultSettings = borderClueDefaults(type);
  let { shape, color, radius, text } = defaultSettings;

  $: color, updateSelectedClue();

  let input: Input;

  const borderClueTypes: BorderClueType[] = [
    'KropkiWhite',
    'KropkiBlack',
    'XvX',
    'XvV',
    'Inequality',
    'Quadruple',
    'Border'
  ];

  $: if ($selectedItemIndex >= 0) {
    borderClueSelected($selectedItemIndex);
  }

  function borderClueSelected(selectedItemIndex: number): void {
    updateSettings($borderClues[selectedItemIndex]);
  }

  function updateSettings(clue: Partial<Borderclue>) {
    type = clue.type ?? 'CUSTOM';
    defaultSettings = borderClueDefaults(clue.type ?? undefined);
    shape = clue.shape ?? defaultSettings.shape;
    color = clue.color ?? defaultSettings.color;
    radius = clue.radius ?? defaultSettings.radius;
    text = clue.text ?? defaultSettings.text;
  }

  function changeType(type: BorderClueType | 'CUSTOM') {
    updateSettings(type !== 'CUSTOM' ? { type } : {});

    updateSelectedClue();
  }

  $: verticalOffset =
    $selectedCells.length <= 1
      ? 0
      : $selectedCells.reduce((prev, curr) => {
          return prev.row >= curr.row ? prev : curr;
        }).row -
        $selectedCells.reduce((prev, curr) => {
          return prev.row <= curr.row ? prev : curr;
        }).row;

  $: horizontalOffset =
    $selectedCells.length <= 1
      ? 0
      : $selectedCells.reduce((prev, curr) => {
          return prev.column >= curr.column ? prev : curr;
        }).column -
        $selectedCells.reduce((prev, curr) => {
          return prev.column <= curr.column ? prev : curr;
        }).column;

  $: canMakeNewBorderClue =
    $selectedCells.length >= 2 &&
    $selectedCells.length <= 4 &&
    verticalOffset <= 1 &&
    horizontalOffset <= 1;

  function newBorderClue(positions: [Position, Position]): Borderclue {
    return {
      positions,
      type: type !== 'CUSTOM' ? type : undefined,
      shape: type === 'CUSTOM' || shape != defaultSettings.shape ? shape : undefined,
      text: type === 'CUSTOM' || text != defaultSettings.text ? text : undefined,
      radius: type === 'CUSTOM' || radius != defaultSettings.radius ? radius : undefined,
      color:
        (type === 'CUSTOM' || color != defaultSettings.color) && color !== 'NONE'
          ? color
          : undefined
    };
  }

  const createNewBorderClue = (): void => {
    if (!canMakeNewBorderClue) return;

    let positions = $selectedCells;
    if (positions.length > 2) {
      let p = positions[0];
      let q = positions.find((q) => q.row !== p.row && q.column !== p.column);
      if (q == null) {
        p = positions[1];
        q = positions.find((q) => q.row !== p.row && q.column !== p.column);
      }
      if (q) {
        positions = [p, q];
      }
    }

    editorHistory.set({
      borderclues: [...deepCopy($borderClues), newBorderClue(positions as [Position, Position])]
    });
    $selectedCells = positions;
    $selectedItemIndex = $borderClues.length - 1;

    addLabel();
  };

  function addLabel() {
    if (type !== 'CUSTOM') {
      const label = $labels.find(
        (l) => l.label.name === borderClueTypesToLabel[type as BorderClueType]
      );
      if (label) {
        label.selected = true;
      }
    }
  }

  const updateSelectedClue = (): void => {
    if ($selectedItemIndex === -1) return;

    let newBorderClues: Borderclue[] = [];
    $borderClues.forEach((borderClue, i) => {
      if (i !== $selectedItemIndex) {
        newBorderClues = [...newBorderClues, borderClue];
      } else {
        newBorderClues = [
          ...newBorderClues,
          newBorderClue(borderClue.positions as [Position, Position])
        ];

        if (type !== borderClue.type) {
          addLabel();
        }
      }
    });
    editorHistory.set({ borderclues: newBorderClues });
  };

  const deleteBorderClueAtIndex = (index: number): void => {
    const newBorderClues = $borderClues.filter((_, i) => index !== i);
    $selectedCells = [];
    $highlightedCells = [];
    $selectedItemIndex = -1;
    editorHistory.set({ borderclues: newBorderClues });
  };

  function handleKeyDown(k: KeyboardEvent): void {
    //do not accept keyboard input when any modal controls are open
    if (hasOpenModals()) return;

    if (!isArrowKey(k.key)) {
      input.focus();
    }

    if (isDeleteKey(k) && $selectedItemIndex >= 0 && text === '') {
      // The input needs to handle backspace on empty input-field as well
      deleteBorderClueAtIndex($selectedItemIndex);
    }

    if (k.key === 'Enter') {
      createNewBorderClue();
    }
  }

  const reorderBorderClue = (index: number, way: 'up' | 'down'): void => {
    let newBorderClues: Borderclue[] = [];
    if (way === 'up') {
      if (index === 0) return;
      newBorderClues = moveArrayElement($borderClues, index, index - 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex--;
      } else if (index - 1 === $selectedItemIndex) {
        $selectedItemIndex++;
      }
    } else if (way === 'down') {
      if (index === $borderClues.length - 1) return;
      newBorderClues = moveArrayElement($borderClues, index, index + 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex++;
      } else if (index + 1 === $selectedItemIndex) {
        $selectedItemIndex--;
      }
    }
    editorHistory.set({ borderclues: newBorderClues });
  };
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="grid grid-cols-2 w-full h-full p-2">
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <div
      class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
    >
      <div class="h-full overflow-y-auto w-full">
        {#each $borderClues as borderClue, index (index)}
          <button
            class={classNames(
              'h-12 w-full flex rounded-md bg-white border border-gray-300 font-medium text-gray-700 overflow-hidden mb-2',
              { 'border-blue-500': index === $selectedItemIndex }
            )}
            on:mouseover={() => {
              $highlightedCells = borderClue.positions;
              $highlightedItemIndex = index;
            }}
            on:focus={() => {
              $highlightedCells = borderClue.positions;
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
                on:click={() => reorderBorderClue(index, 'up')}
              >
                <CaretUp size={16} />
              </div>
              <div
                class="h-1/2 flex justify-center items-center hover:bg-gray-200 p-1"
                on:click={() => reorderBorderClue(index, 'down')}
              >
                <CaretDown size={16} />
              </div>
            </div>
            <span
              class="hover:bg-gray-100 w-full h-full flex items-center justify-center"
              on:click={() => {
                $selectedCells = borderClue.positions;
                $selectedItemIndex = index;
              }}
            >
              {borderClue.type ? borderClueTypeNames[borderClue.type] : 'Custom'}
            </span>
            <div
              class="h-full w-8 p-1 flex justify-center items-center hover:bg-red-100 hover:text-red-500 border-l border-gray-300"
              on:click={() => deleteBorderClueAtIndex(index)}
            >
              <Trash size={16} />
            </div>
          </button>
        {/each}
      </div>
    </div>

    <Button
      variant="secondary"
      class="w-full"
      disabled={!canMakeNewBorderClue}
      on:click={createNewBorderClue}
    >
      <span class="text-sm">New Border clue from selection</span>
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
        {#each borderClueTypes as borderClueType}
          <option value={borderClueType} class="capitalize"
            >{borderClueTypeNames[borderClueType]}</option
          >
        {/each}
        <option value={'CUSTOM'} class="capitalize">Custom</option>
      </OldSelect>
    </div>

    <div>
      <ColorSelect bind:color allowNone={true} class="w-full" />
    </div>

    <div>
      <Label id="shape">Shape</Label>
      <RadioGroup
        options={{
          Circle: {
            icon: Circle,
            color: color !== 'NONE' ? color : 'Black',
            border: color !== 'NONE',
            size: 16
          },
          Square: {
            icon: Square,
            color: color !== 'NONE' ? color : 'Black',
            border: color !== 'NONE',
            size: 16
          },
          Diamond: {
            icon: Diamond,
            color: color !== 'NONE' ? color : 'Black',
            border: color !== 'NONE',
            size: 16
          },
          Star: {
            icon: Star,
            color: color !== 'NONE' ? color : 'Black',
            border: color !== 'NONE',
            size: 16
          },
          Line: { icon: Line, color: color !== 'NONE' ? color : 'Black', border: false, size: 16 }
        }}
        bind:value={shape}
        onChange={() => updateSelectedClue()}
      />
    </div>

    <div>
      <Label id="radius">Radius</Label>
      <div class="flex w-full">
        <input
          class="w-5/6 mr-2"
          id="radius"
          type="range"
          min={5}
          max={100}
          step={1}
          bind:value={radius}
          on:change={() => {
            updateSelectedClue();
          }}
        />
        <span class="text-right w-1/6">{radius}</span>
      </div>
    </div>

    <div>
      <Label id="text">Text</Label>
      <Input
        bind:this={input}
        maxlength={type !== 'Quadruple' ? 4 : 11}
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
  </div>
</div>
