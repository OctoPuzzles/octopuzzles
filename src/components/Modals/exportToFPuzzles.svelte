<script lang="ts">
	import CtCLink from '$components/shareButtons/CtCLink.svelte';
	import FPuzzlesLink from '$components/shareButtons/FPuzzlesLink.svelte';
	import CtC from '$icons/CtC.svelte';
	import FPuzzles from '$icons/FPuzzles.svelte';
	import { compressToBase64 } from '$utils/compressor';
	import { exportAsFPuzzlesJson } from '$utils/exportAsFPuzzlesJson';

	export let isOpen: boolean;

	let puzzleData = compressToBase64(exportAsFPuzzlesJson());
</script>

{#if isOpen}
	<div role="dialog" class="bg-white shadow rounded-md p-4 flex flex-col">
		<FPuzzlesLink class="w-6 h-6 block" {puzzleData}><FPuzzles /></FPuzzlesLink>
		<CtCLink class="w-6 h-6 block" {puzzleData}><CtC /></CtCLink>
	</div>
{/if}
