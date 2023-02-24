<script lang="ts">
	import WalkthroughViewer from '$features/walkthroughs/WalkthroughViewer.svelte';
	import type { WalkthroughStep } from '$models/Walkthrough';
	import type { EditorHistoryStep } from '$types';

	export let isOpen: boolean;

	export let clues: EditorHistoryStep;
	export let walkthrough: WalkthroughStep[];
</script>

{#if isOpen}
	<div
		role="dialog"
		class="bg-white shadow max-h-[90vh] rounded-md flex flex-col overflow-y-hidden"
	>
		<WalkthroughViewer {clues} {walkthrough} />
	</div>
{/if}
