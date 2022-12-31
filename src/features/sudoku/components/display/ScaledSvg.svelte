<script lang="ts">
	import { onMount } from 'svelte';

	let svgInstance: SVGElement;

	onMount(() => {
		const children = svgInstance.querySelectorAll(
			'text, line, polyline, rect, circle, path, polygon'
		);
		let bounds: { xMin?: number; yMin?: number; xMax?: number; yMax?: number } = {};
		children.forEach((child) => {
			const { x, y, width, height } = (child as SVGGraphicsElement).getBBox();
			if (!bounds.xMin || x < bounds.xMin) bounds.xMin = x;
			if (!bounds.xMax || x + width > bounds.xMax) bounds.xMax = x + width;
			if (!bounds.yMin || y < bounds.yMin) bounds.yMin = y;
			if (!bounds.yMax || y + height > bounds.yMax) bounds.yMax = y + height;
		});

		const xMin = (bounds.xMin ?? 0) - 5;
		const yMin = (bounds.yMin ?? 0) - 5;
		const xMax = (bounds.xMax ?? 0) + 5;
		const yMax = (bounds.yMax ?? 0) + 5;

		const viewbox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;

		svgInstance.setAttribute('viewBox', viewbox);
	});
</script>

<svg class="w-full h-full" bind:this={svgInstance}>
	<slot />
</svg>
