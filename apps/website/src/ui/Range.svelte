<script lang="ts">
  import Label from './Label.svelte';

  export let value: number;
  export let label: string;
  export let id: string;
  export let min: number;
  export let max: number;
  export let step = 1;
</script>

<Label {id} class="mb-0">{label}</Label>
<input type="range" {id} name={id} {min} {max} {step} bind:value on:change class="w-full" />
