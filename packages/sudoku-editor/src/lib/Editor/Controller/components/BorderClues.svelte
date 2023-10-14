<script lang="ts">
  import {
    Button,
    Input,
    Label,
    RadioGroup,
    ControllerButton,
    Select,
    ScaledSvg,
    ColorSelect,
    Checkbox,
    Range
  } from '@octopuzzles/ui';
  import {
    editorHistory,
    handleArrows,
    selectedItemIndex,
    selectedCells,
    highlightedCells,
    highlightedItemIndex
  } from '$lib/sudokuStore';
  import { deepCopy, isArrowKey, moveArrayElement, isDeleteKey } from '@octopuzzles/utils';
  import { defaultHandleArrows } from '$lib/sudokuStore/interactionHandlers';
  import { borderClueDefaults } from '@octopuzzles/sudoku-utils';
  import type { Borderclue, BorderClueType, Position, Shape } from '@octopuzzles/models';
  import { Borderclue as BorderclueComponent } from '@octopuzzles/sudoku-display';
  import { borderClueTypesToLabel, borderClueTypeNames } from '$lib/constants';
  import { addLabel } from '$lib/utils/addLabel';
  import { editorAction } from '$lib/editorAction';

  const sudokuClues = editorHistory.subscribeToClues();

  let type: BorderClueType | 'CUSTOM' = $sudokuClues.borderclues[0]?.type ?? 'CUSTOM';
  let defaultSettings = borderClueDefaults(type);
  let { shape, color, radius, text, nonStandard } = defaultSettings;

  $: color, updateSelectedClue();

  let input: Input;

  const shapes: Shape[] = ['Circle', 'Square', 'Diamond', 'Star', 'Line'];

  const borderClueTypes: (BorderClueType | 'CUSTOM')[] = [
    'KropkiWhite',
    'KropkiBlack',
    'XvX',
    'XvV',
    'Inequality',
    'Quadruple',
    'Border',
    'CUSTOM'
  ];

  $: if ($selectedItemIndex >= 0) {
    borderClueSelected($selectedItemIndex);
  }

  function borderClueSelected(selectedItemIndex: number): void {
    updateSettings($sudokuClues.borderclues[selectedItemIndex]);
  }

  function updateSettings(clue: Partial<Borderclue>): void {
    type = clue.type ?? 'CUSTOM';
    defaultSettings = borderClueDefaults(clue.type ?? undefined);
    shape = clue.shape ?? defaultSettings.shape;
    color = clue.color ?? defaultSettings.color;
    radius = clue.radius ?? defaultSettings.radius;
    text = clue.text ?? defaultSettings.text;
    nonStandard = clue.nonStandard ?? defaultSettings.nonStandard;
  }

  function changeType(type: BorderClueType | 'CUSTOM'): void {
    updateSettings(type !== 'CUSTOM' ? { type } : {});

    updateSelectedClue();
  }

  function toggleNonStandard(): void {
    nonStandard = !nonStandard;
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
      shape: type === 'CUSTOM' || shape !== defaultSettings.shape ? shape : undefined,
      text: type === 'CUSTOM' || text !== defaultSettings.text ? text : undefined,
      radius: type === 'CUSTOM' || radius !== defaultSettings.radius ? radius : undefined,
      color:
        (type === 'CUSTOM' || color !== defaultSettings.color) && color !== 'NONE'
          ? color
          : undefined
    };
  }

  const createNewBorderClue = (): void => {
    if (canMakeNewBorderClue === false) return;

    let positions = $selectedCells;
    if (positions.length > 2) {
      let position1 = positions[0];
      let position2 = positions.find(
        (q) => q.row !== position1.row && q.column !== position1.column
      );
      if (position2 == null) {
        position1 = positions[1];
        position2 = positions.find((q) => q.row !== position1.row && q.column !== position1.column);
      }
      if (position2) {
        positions = [position1, position2];
      }
    }

    editorHistory.set({
      borderclues: [
        ...deepCopy($sudokuClues.borderclues),
        newBorderClue(positions as [Position, Position])
      ]
    });
    $selectedCells = positions;
    $selectedItemIndex = $sudokuClues.borderclues.length - 1;

    if (type !== 'CUSTOM') {
      addLabel(borderClueTypesToLabel[type as BorderClueType]);
    }
  };

  const updateSelectedClue = (): void => {
    if ($selectedItemIndex === -1) return;

    let newBorderClues: Borderclue[] = [];
    $sudokuClues.borderclues.forEach((borderClue, i) => {
      if (i !== $selectedItemIndex) {
        newBorderClues = [...newBorderClues, borderClue];
      } else {
        newBorderClues = [
          ...newBorderClues,
          newBorderClue(borderClue.positions as [Position, Position])
        ];

        if (type !== borderClue.type && type !== 'CUSTOM') {
          addLabel(borderClueTypesToLabel[type as BorderClueType]);
        }
      }
    });
    editorHistory.set({ borderclues: newBorderClues });
  };

  const deleteBorderClueAtIndex = (index: number): void => {
    const newBorderClues = $sudokuClues.borderclues.filter((_, i) => index !== i);
    $selectedCells = [];
    $highlightedCells = [];
    $selectedItemIndex = -1;
    editorHistory.set({ borderclues: newBorderClues });
  };

  function handleKeyDown(k: KeyboardEvent): void {
    if (!isArrowKey(k)) {
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
      newBorderClues = moveArrayElement($sudokuClues.borderclues, index, index - 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex--;
      } else if (index - 1 === $selectedItemIndex) {
        $selectedItemIndex++;
      }
    } else if (way === 'down') {
      if (index === $sudokuClues.borderclues.length - 1) return;
      newBorderClues = moveArrayElement($sudokuClues.borderclues, index, index + 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex++;
      } else if (index + 1 === $selectedItemIndex) {
        $selectedItemIndex--;
      }
    }
    editorHistory.set({ borderclues: newBorderClues });
  };
</script>

<svelte:window use:editorAction={{ onKeyDown: handleKeyDown }} />

<div class="grid grid-cols-2 w-full h-full p-2">
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <div
      class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
    >
      <div class="h-full overflow-y-auto w-full">
        {#each $sudokuClues.borderclues as borderClue, index (index)}
          <ControllerButton
            isHighlighted={index === $selectedItemIndex}
            onClick={() => {
              $selectedCells = borderClue.positions;
              $selectedItemIndex = index;
            }}
            onDelete={() => deleteBorderClueAtIndex(index)}
            onHover={() => {
              $highlightedCells = borderClue.positions;
              $highlightedItemIndex = index;
            }}
            onHoverOut={() => {
              $highlightedCells = [];
              $highlightedItemIndex = -1;
            }}
            onMoveDown={() => reorderBorderClue(index, 'down')}
            onMoveUp={() => reorderBorderClue(index, 'up')}
          >
            <ScaledSvg>
              <BorderclueComponent borderclue={borderClue} />
            </ScaledSvg>
          </ControllerButton>
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
      <Select onChange={() => changeType(type)} options={borderClueTypes} bind:option={type}>
        <svelte:fragment slot="label">Type</svelte:fragment>
        <div slot="option" let:option>
          {borderClueTypeNames[option]}
        </div>
      </Select>
    </div>

    <div>
      <ColorSelect bind:color allowNone={true} class="w-full" />
    </div>

    <div>
      <Label id="shape">Shape</Label>
      <RadioGroup
        options={shapes}
        name="Shape"
        idFromOption={(o) => o}
        bind:value={shape}
        let:option
        onChange={() => updateSelectedClue()}
      >
        <ScaledSvg>
          <BorderclueComponent
            borderclue={{
              positions: [
                { row: 0, column: 0 },
                { row: 0, column: 1 }
              ],
              color: color === 'NONE' ? 'Black' : color,
              radius: 10,
              shape: option,
              text
            }}
          />
        </ScaledSvg>
      </RadioGroup>
    </div>

    <div>
      <Label id="radius">Radius {radius}:</Label>
      <div class="block w-full">
        <Range
          bind:value={radius}
          min={5}
          max={100}
          id="radius"
          onChange={() => {
            updateSelectedClue();
          }}
        />
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
