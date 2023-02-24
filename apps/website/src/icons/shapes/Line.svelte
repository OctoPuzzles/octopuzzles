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
    {#if border}
      <path
        d="M 0 128 L 256 128"
        stroke-linecap="square"
        stroke-width={(3 * 256) / size + 6}
        class="stroke-black"
      />
    {/if}
    <path
      d={`M ${border ? 6 : 0} 128 L ${border ? 250 : 256} 128`}
      stroke-linecap="butt"
      stroke-width={(3 * 256) / size}
      class={classNames('stroke-current', {
        [`text-${color?.toLowerCase()}`]: color != null,
        'text-white-500': color == null
      })}
    />
  </g>
</svg>
