<script lang="ts">
  import { Colors } from '@octopuzzles/models';
  import type { Color } from '@octopuzzles/models';
  import { capitalize } from '@octopuzzles/utils';

  import classNames from 'classnames';
  import { Select } from '@octopuzzles/ui';

  let className = '';
  export let color: Color | 'NONE';
  export let icons = true;
  export let allowNone = false;
  export let onChange: ((option: Color | 'NONE') => void) | undefined = undefined;

  export { className as class };
</script>

<Select
  options={allowNone ? ['NONE', ...Colors] : Colors}
  bind:option={color}
  class={classNames(className)}
  {onChange}
>
  <svelte:fragment slot="label">Color</svelte:fragment>
  <div slot="option" let:option class="flex items-center w-full gap-2">
    {#if icons}
      {#if option.toLowerCase() === 'white'}
        <div class="w-4 h-4 border border-gray-300 bg-{option.toLowerCase()}-500 rounded-lg" />
      {:else}
        <div class="w-4 h-4 bg-{option.toLowerCase()}-500 rounded-lg" />
      {/if}
    {/if}
    <p>{capitalize(option)}</p>
  </div>
</Select>
