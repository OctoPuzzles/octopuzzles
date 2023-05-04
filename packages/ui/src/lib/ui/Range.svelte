<script lang="ts">
  import DualRange from './DualRange.svelte';

  export let value: number;
  export let id: string;
  export let min: number;
  export let max: number;
  export let step = 1;
  export let onChange: ((newValue: number) => void) | undefined = undefined;
  export let formatter = (n: number): string => String(n);

  let values = [value];
  $: value = values[0];
  $: onChange?.(value);
</script>

<DualRange {...$$props} {step} {min} {max} {id} bind:values {formatter} />
