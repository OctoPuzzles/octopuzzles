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
    <path
      d="M 236 139.3
            L 139.3 236
            a 15.9 15.9 0 0 1 -22.6 0
            L 20 139.3
            a 16.1 16.1 0 0 1 0 -22.6
            L 116.7 20
            a 16.1 16.1 0 0 1 22.6 0
            L 236 116.7
            A 16.1 16.1 0 0 1 236 139.3
            Z"
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
