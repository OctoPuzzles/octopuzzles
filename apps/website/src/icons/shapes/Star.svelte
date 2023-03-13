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
      d="M 132.9 196.4
            l 57.5 36.5
            c 7.4 4.7 16.5 -2.3 14.4 -10.8
            l -16.6 -65.4
            a 9.9 9.9 0 0 1 3.3 -10.0
            l 51.5 -43.0
            c 6.7 -5.6 3.3 -16.9 -5.5 -17.4
            l -67.3 -4.3
            a 9.5 9.5 0 0 1 -8.3 -6.2
            l -25.1 -63.2
            a 9.5 9.5 0 0 0 -17.8 0
            l -25.1 63.2
            a 9.5 9.5 0 0 1 -8.3 6.2
            L 18.4 86.2
            c -8.8 0.6 -12.2 11.9 -5.5 17.4
            L 64.4 146.6
            a 9.9 9.9 0 0 1 3.3 10.0
            L 52.3 217.3
            c -2.6 10.3 8.3 18.6 17.1 13.0
            l 53.5 -33.9
            A 9.3 9.3 0 0 1 132.9 196.4
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
