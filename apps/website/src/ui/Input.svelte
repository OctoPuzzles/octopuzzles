<script lang="ts">
  import Label from '$ui/Label.svelte';
  import classNames from 'classnames';

  /** Label */
  export let label = '';
  /** Input id */
  export let id = '';
  /** Render as textarea */
  export let asTextarea = false;
  let className = '';
  export { className as class };
  /**
   * Number of rows in textarea. Has no effect if asTextarea is set to false */
  export let rows = 3;
  /** Value of input/textarea */
  export let value: string | number | string[];
  /** If the helptext slot should be hidden */
  export let hideHelpSlot = false;

  let input: HTMLInputElement | HTMLTextAreaElement;

  export const focus = (): void => {
    input.focus();
  };
</script>

{#if label}
  <Label {id}>
    {label}
  </Label>
{/if}
{#if asTextarea}
  <textarea
    {...$$props}
    {id}
    class={classNames(
      'border border-gray-300 py-2 px-4 leading-5 rounded-md w-full focus:ring focus:ring-blue-300 focus:border-blue-500 h-40 disabled:bg-gray-200',
      className
    )}
    bind:value
    on:input
    on:blur
    on:focus
    bind:this={input}
    {rows}
  />
{:else}
  <input
    {...$$props}
    {id}
    bind:this={input}
    bind:value
    on:input
    on:blur
    on:focus
    class={classNames(
      'border border-gray-300 py-2 px-4 rounded-md leading-5 w-full focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500',
      className
    )}
  />
{/if}
<div class="my-1 text-xs text-red-500">
  <!-- Error text -->
  <slot name="error" />
</div>
{#if !hideHelpSlot}
  <div class="my-1 text-xs text-gray-500">
    <!-- Help text. If the error slot is filled, this is not displayed -->
    <slot name="help" />
  </div>
{/if}
