<script lang="ts">
  import { rotationsToDegree } from '$constants';
  import type { Color, Rotation } from '$models/Sudoku';

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
    <line
      x1="128"
      y1="210"
      x2="128"
      y2="40"
      fill="none"
      class="stroke-current text-{color.toLowerCase()}"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={5}
    />
    <polyline
      points="92 76 128 40 164 76"
      fill="none"
      class="stroke-current text-{color.toLowerCase()}"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={5}
    />
  </g>
</svg>
