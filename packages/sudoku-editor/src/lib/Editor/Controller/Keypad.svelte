<script lang="ts">
  import { Keypad } from '@octopuzzles/ui';
  import { isDeleteKey } from '@octopuzzles/utils';
  import { editorAction } from '$lib/editorAction';
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

  function handleKeyDown(k: KeyboardEvent): void {
    if (isDeleteKey(k)) {
      handleKey('');
    } else {
      const key = k.code.startsWith('Digit') ? k.code.replace('Digit', '') : k.key;
      if (isValidDigit(key)) {
        handleKey(key);
      }
    }
  }

  function handleKey(key: string): void {
    handleDigit?.(key as Digit);
  }
</script>

<svelte:window use:editorAction={{ onKeyDown: handleKeyDown }} />

<Keypad
  getButtonInfo={(key) => {
    return { ...getButtonInfo?.(key), disabled: !isValidDigit(key) };
  }}
  handleButtonClick={handleKey}
>
  <div slot="digit" let:digit>
    <slot name="digit" {digit} />
  </div>
</Keypad>
