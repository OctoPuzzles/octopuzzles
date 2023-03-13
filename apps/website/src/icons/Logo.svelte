<script lang="ts">
  export let size = 40;
  export let withText = true;
</script>

<svg
  viewBox="0 0 500 132"
  class="stroke-current text-orange-500"
  width={size}
  aria-labelledby="title"
  aria-describedby="description"
  role="img"
>
  <title id="title">Logo</title>
  <desc id="description"> A yellow arrow pointing right, with a gridlike interior pattern. </desc>
  <rect
    transform="rotate(45)"
    y="-29.735001"
    x="94.752281"
    height="29.735001"
    width="29.735001"
    fill="none"
    stroke-width="3"
  />
  <rect
    fill="none"
    stroke-width="3"
    width="29.734999"
    height="29.734999"
    x="65.017281"
    y="-29.735001"
    transform="rotate(45)"
  />
  <rect
    transform="rotate(45)"
    y="-2.7684797e-07"
    x="94.752281"
    height="29.734999"
    width="29.734999"
    fill="none"
    stroke-width="3"
  />
  <rect
    transform="rotate(45)"
    y="-29.735001"
    x="35.282314"
    height="29.734999"
    width="29.734999"
    fill="none"
    stroke-width="3"
  />
  <rect
    fill="none"
    stroke-width="3"
    width="29.734999"
    height="29.734999"
    x="94.752281"
    y="29.735004"
    transform="rotate(45)"
  />
  <rect
    fill="none"
    stroke-width="3"
    width="29.734999"
    height="29.734999"
    x="65.017281"
    y="-4.0915452e-06"
    transform="rotate(45)"
  />
  <path
    d="M 45.97418,3.9225397 C 109.05164,66.999995 109.05164,66.999995 109.05164,66.999995 L 45.974183,130.07746 24.948361,109.05164 45.97418,88.02582 24.948361,66.999995 45.97418,45.974178 24.948359,24.948357 Z"
    fill="none"
    stroke-width="5"
    stroke-linecap="butt"
    stroke-linejoin="round"
    paint-order="fill markers stroke"
  />
  {#if withText}
    <text x={130} y={86.5} class="text-black text-6xl">OctoPuzzles</text>
  {/if}
</svg>
