<script lang="ts">
	import { cellSize } from '$constants';

	export let row: number;
	export let column: number;
</script>

<rect
	class="w-cell h-cell stroke-black fill-none stroke-0.5"
	x={cellSize * column}
	y={cellSize * row}
	vector-effect="non-scaling-size"
/>
