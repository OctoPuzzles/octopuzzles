<script lang="ts">
	import Plus from 'phosphor-svelte/lib/Plus/Plus.svelte';

	import { closeModal } from '$stores/modalStore';
	import Button from '$ui/Button.svelte';
	import deepCopy from '$utils/deepCopy';
	import classNames from 'classnames';
	import type { Label } from '$models/Label';
	import { editorHistory } from '$stores/sudokuStore';

	export let isOpen: boolean;
	export let currentDescription: string;
	export let addLabel: (label: Label) => string;

	let previewedDescription = '';
	const labels = editorHistory.labels;
</script>

{#if isOpen}
	<div role="dialog" class="bg-white shadow rounded-md flex flex-col">
		<div class="w-full p-4 border-b border-gray-300">
			<h2 class="text-2xl font-semibold">Add common descriptions</h2>
		</div>
		<div class="flex h-80">
			<ul class="flex flex-col gap-px border-r border-gray-300 overflow-y-auto w-96 h-full">
				{#each deepCopy($labels).sort( (l, m) => (l.selected === m.selected ? 0 : l.selected ? -1 : 1) ) as item, i}
					<li
						class={classNames(
							'py-2 px-4 w-full flex justify-between items-center cursor-pointer bg-white',
							{ 'border-t border-gray-300': i !== 0 }
						)}
						on:click={() => (previewedDescription = item.label.description)}
					>
						<p>{item.label.name}</p>
						<button
							class="p-1 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
							on:click={() => (currentDescription = addLabel(item.label))}
						>
							<Plus size={24} />
						</button>
					</li>
				{/each}
			</ul>
			<div class="w-96 h-full p-2">
				{#if currentDescription !== ''}
					<p class="text-gray-400 text-sm">
						{#if currentDescription.length > 100}
							...
						{/if}
						{currentDescription.slice(-100)}
					</p>
					<br />
				{/if}
				<p>{previewedDescription}</p>
			</div>
		</div>

		<div class="w-full p-4 border-t border-gray-300 flex justify-end">
			<Button variant="primary" on:click={closeModal}>Done</Button>
		</div>
	</div>
{/if}
