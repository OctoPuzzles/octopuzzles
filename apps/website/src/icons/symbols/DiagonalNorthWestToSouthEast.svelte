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
      x1="256"
      y1="256"
      x2="0"
      y2="0"
      fill="none"
      class="stroke-current text-{color.toLowerCase()}"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={5}
    />
  </g>
</svg>
