<script lang="ts">
  import { Keypad } from '@octopuzzles/ui';
  import { deepCopy, isDeleteKey, undefinedIfEmpty } from '@octopuzzles/utils';
  import { gameHistory, selectedCells } from '$lib/sudokuStore';
  import { gameAction } from '$lib/gameAction';
  import { get } from 'svelte/store';
  import type { Digit } from '@octopuzzles/models';

  export let getButtonInfo: ((key: string) => { class?: string; custom?: boolean }) | undefined =
    undefined;
  export let handleDigit: ((digit: Digit | '') => void) | undefined = undefined;

  export let validDigits: Digit[] | undefined = undefined;

  function isValidDigit(key: string) {
    const digit = key as Digit;

    if (validDigits === undefined) {
      return key >= '0' && key <= '9';
    } else {
      validDigits.includes(digit);
    }
  }

  const { givens, logic } = get(gameHistory.clues);
  const sCells = logic.flags?.includes('SCells') ?? false;
  const doublers = logic.flags?.includes('Doublers') ?? false;

  function handleKeyDown(k: KeyboardEvent): void {
    if (isDeleteKey(k)) {
      handleKey('');
    } else {
      const key = k.code.startsWith('Digit') ? k.code.replace('Digit', '') : k.key;
      if (isValidDigit(key) || (key === '/' && sCells) || (key === '*' && doublers)) {
        handleKey(key);
      }
    }
  }

  function handleKey(key: string): void {
    if (key === '/' || key === '*') {
      const positions = get(selectedCells).filter((p) => !(givens[p.row]?.[p.column] !== ''));
      if (positions.length === 0) return;

      const currentCellValues = get(gameHistory.getValue('cellValues'));
      let newCellValues = deepCopy(currentCellValues);
      const modifier = key === '/' ? 'SCell' : 'Doubler';
      const allCellsHaveModifier = positions.every((p) =>
        currentCellValues[p.row][p.column].modifiers?.includes(modifier)
      );

      if (!allCellsHaveModifier) {
        // Add it to the cells that does not have it
        positions.forEach((p) => {
          const modifiers = currentCellValues[p.row][p.column].modifiers;
          if (modifiers) {
            if (!modifiers.includes(modifier)) {
              newCellValues[p.row][p.column].modifiers = [...modifiers, modifier];
            }
          } else {
            newCellValues[p.row][p.column].modifiers = [modifier];
          }
        });
      } else {
        // Remove it from all cells
        positions.forEach((p) => {
          const modifiers = currentCellValues[p.row][p.column].modifiers;
          if (modifiers) {
            newCellValues[p.row][p.column].modifiers = undefinedIfEmpty(
              modifiers.filter((m) => m !== modifier)
            );
          }
        });
      }

      gameHistory.set({
        cellValues: newCellValues
      });
    } else {
      handleDigit?.(key as Digit);
    }
  }
</script>

<svelte:window use:gameAction={{ onKeyDown: handleKeyDown }} />

<Keypad
  getButtonInfo={(key) => {
    return { ...getButtonInfo?.(key), disabled: !isValidDigit(key) };
  }}
  handleButtonClick={handleKey}
  extraKey={sCells ? '/' : doublers ? '*' : undefined}
  extraKeyDescription={sCells ? 'S-Cell' : doublers ? 'Doubler' : undefined}
>
  <div slot="digit" let:digit>
    <slot name="digit" {digit} />
  </div>
</Keypad>
