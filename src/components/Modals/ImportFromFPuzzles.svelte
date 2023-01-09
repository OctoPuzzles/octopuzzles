<script lang="ts">
	import { closeModal } from '$stores/modalStore';
	import Button from '$ui/Button.svelte';
	import Input from '$ui/Input.svelte';
	import { decompressFromBase64 } from '$utils/compressor';
	import type { FPuzzlesJson } from '$utils/fPuzzles';
	import { importFPuzzleIntoEditorHistory } from '$utils/importFPuzzleIntoEditor';

	export let isOpen: boolean;

	let url = '';
	let loading = false;
	let error = '';

	function importPuzzle(): void {
		const beginnings = ['https://www.f-puzzles.com/?load=', 'https://f-puzzles.com/?load='];
		if (beginnings.every((b) => !url.startsWith(b))) {
			error = `Please specify a url starting with one of ${beginnings.join(', ')}`;
			return;
		}

		const importantPart = url.replace(/^.*f-puzzles\.com\/\?load=/, '');

		const jsonString = decompressFromBase64(importantPart) as FPuzzlesJson;

		if (jsonString == null) {
			error = 'Something went wrong when getting the data from f-puzzles. Please try again.';
			return;
		}

		importFPuzzleIntoEditorHistory(jsonString);

		closeModal();
	}
</script>

{#if isOpen}
	<div role="dialog" class="bg-white shadow rounded-md p-4 flex flex-col">
		<h2>Import puzzle from f-puzzles.com</h2>
		{#if error.length > 0}
			<p class="text-red-500">{error}</p>
		{/if}

		<Input class="mt-4" placeholder="https://www.f-puzzles.com/?load=abcdef..." bind:value={url} />

		<Button {loading} variant="default" class="mt-8" on:click={closeModal}>Cancel</Button>
		<Button {loading} variant="primary" class="mt-2" on:click={importPuzzle}>Import</Button>
	</div>
{/if}
