<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  let svgInstance: SVGElement;

  function setViewbox(): void {
    const children = svgInstance.querySelectorAll(
      'text, line, polyline, rect, circle, path, polygon'
    );
    const bounds: { xMin?: number; yMin?: number; xMax?: number; yMax?: number } = {};
    children.forEach((child) => {
      const { x, y, width, height } = (child as SVGGraphicsElement).getBBox();
      if (x === 0 && y === 0 && width === 0 && height === 0) return;
      if (bounds.xMin == null || x < bounds.xMin) bounds.xMin = x;
      if (bounds.xMax == null || x + width > bounds.xMax) bounds.xMax = x + width;
      if (bounds.yMin == null || y < bounds.yMin) bounds.yMin = y;
      if (bounds.yMax == null || y + height > bounds.yMax) bounds.yMax = y + height;
    });

    const xMin = (bounds.xMin ?? 0) - 5;
    const yMin = (bounds.yMin ?? 0) - 5;
    const xMax = (bounds.xMax ?? 0) + 5;
    const yMax = (bounds.yMax ?? 0) + 5;

    const viewbox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;

    svgInstance.setAttribute('viewBox', viewbox);
  }

  afterUpdate(() => setViewbox());
  onMount(() => setViewbox());
</script>

<svg class="w-full h-full" bind:this={svgInstance}>
  <slot />
</svg>
