<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  import { BROWSER } from 'esm-env';

  export let min: number;
  export let max: number;
  export let step = 1;
  export let values: number[];
  export let formatter = (n: number): string => String(n);
  export let pips = false;
  export let float = true;
  export let range = values.length > 1 ? true : 'min';
  export let id: string;
</script>

{#if BROWSER}
  <RangeSlider
    {...$$props}
    {id}
    {min}
    {max}
    {step}
    {range}
    bind:values
    {float}
    {pips}
    {formatter}
    springValues={{ stiffness: 1, damping: 1 }}
    --range-handle-focus="orange"
    --range-handle="orange"
    --range-handle-inactive="orange"
    --range-range-inactive="orange"
  />
{/if}
