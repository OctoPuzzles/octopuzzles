<script lang="ts">
  import classNames from 'classnames';
  import { onDestroy, onMount } from 'svelte';

  let className = '';
  export { className as class };

  /** Millisecond time for the animation tick */
  const TICK = 100;

  let t = 0;

  let timer: ReturnType<typeof setInterval>;

  let target: SVGSVGElement;

  let observer: IntersectionObserver;

  onMount(() => {
    // Stop animating when the loader is not in the viewport
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          clearInterval(timer);
          timer = setInterval(() => {
            t = (t + 1) % 8;
          }, TICK);
        } else {
          clearInterval(timer);
        }
      });
    });

    observer.observe(target);
  });

  onDestroy(() => {
    observer.disconnect();
    clearInterval(timer);
  });
</script>

<svg
  bind:this={target}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-3 -3 96 96"
  class={classNames('stroke-current relative', className)}
>
  <g>
    <!-- Anchor rect, should not be removed -->
    <rect y="30" x="30" height="30" width="30" fill="none" stroke-width="3" />
    {#if t < 5}
      <rect y="0" x="0" height="30" width="30" fill="none" stroke-width="3" />
    {/if}
    {#if t > 0 && t < 6}
      <rect y="0" x="30" height="30" width="30" fill="none" stroke-width="3" />
    {/if}
    {#if t > 1 && t < 7}
      <rect y="0" x="60" height="30" width="30" fill="none" stroke-width="3" />
    {/if}
    {#if t > 2}
      <rect y="30" x="60" height="30" width="30" fill="none" stroke-width="3" />
    {/if}
    {#if t > 3 || t < 1}
      <rect y="60" x="60" height="30" width="30" fill="none" stroke-width="3" />
    {/if}
    {#if t > 4 || t < 2}
      <rect y="60" x="30" height="30" width="30" fill="none" stroke-width="3" />
    {/if}
    {#if t > 5 || t < 3}
      <rect y="60" x="0" height="30" width="30" fill="none" stroke-width="3" />
    {/if}
    {#if t > 6 || t < 4}
      <rect y="30" x="0" height="30" width="30" fill="none" stroke-width="3" />
    {/if}
  </g>
</svg>
