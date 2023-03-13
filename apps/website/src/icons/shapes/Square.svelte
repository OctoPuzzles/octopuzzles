<script lang="ts">
  import { rotationsToDegree } from '$constants';
  import type { Color, Rotation } from '$models/Sudoku';
  import classNames from 'classnames';

  export let size = 64;
  export let color: Color | undefined;
  export let border = false;
  export let rotation: Rotation | undefined;
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
    <rect width="256" height="256" fill="none" />
    <rect
      x="6"
      y="6"
      width="244"
      height="244"
      rx="8"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="12"
      class={classNames(`fill-current`, {
        'stroke-black': border,
        'stroke-current': !border,
        [`text-${color?.toLowerCase()}`]: color != null,
        'text-white-500': color == null
      })}
    />
  </g>
</svg>
