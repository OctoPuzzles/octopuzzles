<script lang="ts">
  import { rotationsToDegree } from '$lib/constants';
  import type { Color, Rotation } from '@octopuzzles/models';

  export let size = 64;
  export let color: Color;
  export let rotation: Rotation | undefined | null;
  export let x = 0;
  export let y = 0;

  $: rotate = rotationsToDegree[rotation ?? 'North'];
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  fill="#000000"
  {x}
  {y}
  viewBox="0 0 256 256"
>
  <g transform="rotate({rotate} 128 128)">
    {#if rotate % 90 === 0}
      <polyline
        points="92 56 128 20 164 56"
        fill="none"
        class="stroke-current text-{color.toLowerCase()}"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={5}
      />
    {:else}
      <polyline
        points="92 36 128 0 164 36"
        fill="none"
        class="stroke-current text-{color.toLowerCase()}"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={5}
      />
    {/if}
  </g>
</svg>
