<script lang="ts">
  import Button from '$ui/Button.svelte';
  import Input from '$ui/Input.svelte';
  import Label from '$ui/Label.svelte';
  import ColorSelect from '$ui/ColorSelect.svelte';
  import RadioGroup from '$ui/RadioGroup.svelte';
  import { borderClueTypeNames, borderClueTypesToLabel } from '$constants';
  import { editorHistory, handleArrows, highlights } from '$stores/sudokuStore';
  import deepCopy from '$utils/deepCopy';
  import isArrowKey from '$utils/keyboard/isArrowKey';
  import moveArrayElement from '$utils/moveArrayElement';
  import { defaultHandleArrows } from '$stores/sudokuStore/interactionHandlers';
  import { isDeleteKey } from '$utils/keyboard/isDeleteKey';
  import { borderClueDefaults } from '$utils/prefabs';
  import type { Borderclue, BorderClueType, Position, Shape } from '$models/Sudoku';
  import { hasOpenModals } from '$stores/modalStore';
  import ControllerButton from '$ui/ControllerButton.svelte';
  import Select from '$ui/Select.svelte';
  import ScaledSvg from '$components/Sudoku/Display/ScaledSvg.svelte';
  import { default as BorderclueComponent } from '$components/Sudoku/Display/Clues/borderclues/Borderclue.svelte';

  const { selectedItemIndex, selectedCells, highlightedCells, highlightedItemIndex } = highlights;
  const sudokuClues = editorHistory.subscribeToClues();
  const labels = editorHistory.labels;

  let type: BorderClueType | 'CUSTOM' = $sudokuClues.borderclues[0]?.type ?? 'CUSTOM';
  let defaultSettings = borderClueDefaults(type);
  let { shape, color, radius, text } = defaultSettings;

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
      borderclues: [
        ...deepCopy($sudokuClues.borderclues),
        newBorderClue(positions as [Position, Position])
      ]
    });
    $selectedCells = positions;
    $selectedItemIndex = $sudokuClues.borderclues.length - 1;

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
    $sudokuClues.borderclues.forEach((borderClue, i) => {
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
    const newBorderClues = $sudokuClues.borderclues.filter((_, i) => index !== i);
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

<svelte:window on:keydown={handleKeyDown} />

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
