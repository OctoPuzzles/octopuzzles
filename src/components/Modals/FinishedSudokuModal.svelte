<script lang="ts">
	import FacebookLink from '$components/shareButtons/FacebookLink.svelte';
	import RedditLink from '$components/shareButtons/RedditLink.svelte';
	import TwitterLink from '$components/shareButtons/TwitterLink.svelte';
	import WhatsAppLink from '$components/shareButtons/WhatsAppLink.svelte';
	import FacebookLogo from 'phosphor-svelte/lib/FacebookLogo/FacebookLogo.svelte';
	import RedditLogo from 'phosphor-svelte/lib/RedditLogo/RedditLogo.svelte';
	import TwitterLogo from 'phosphor-svelte/lib/TwitterLogo/TwitterLogo.svelte';
	import WhatsappLogo from 'phosphor-svelte/lib/WhatsappLogo/WhatsappLogo.svelte';
	import Image from 'phosphor-svelte/lib/Image/Image.svelte';
	import ClipboardText from 'phosphor-svelte/lib/ClipboardText/ClipboardText.svelte';
	import { closeModal } from '$stores/modalStore';
	import Button from '$ui/Button.svelte';
	import Input from '$ui/Input.svelte';
	import { getUserSolution } from '$utils/getSolution';
	import { editorHistory, gameHistory } from '$stores/sudokuStore';
	import { get } from 'svelte/store';

	export let isOpen: boolean;
	export let sudokuId: number;
	export let takeScreenshot: () => void;
	export let finishTime: string;

	let solutionCodeKey: string = '';
	let solutionCode: string = '';

	function generateSolutionCode(): void {
		const solution = getUserSolution(
			get(gameHistory.getValue('cellValues')),
			get(editorHistory.getClue('givens'))
		);

		solutionCode = '';
		solutionCodeKey.split(';').forEach((k) => {
			if (k[0] === 'R') {
				const row = parseInt(k.substring(1)) - 1;
				if (row >= 0 && row < solution.length) {
					solution[row].forEach((cell) => {
						if (cell.digits) {
							solutionCode += cell.digits.join('');
						}
					});
				}
			} else if (k[0] === 'C') {
				const column = parseInt(k.substring(1)) - 1;
				if (column >= 0 && column < solution[0].length) {
					solution.forEach((r) => {
						const cell = r[column];
						if (cell.digits) {
							solutionCode += cell.digits?.join('') ?? '';
						}
					});
				}
			}
		});
	}

	const copySolutionCode = async () => {
		try {
			await navigator.clipboard.writeText(solutionCode);
			console.log('Copied solution code to clipboard');
		} catch (err) {
			console.error('Failed to copy solution code: ', err);
		}
	};
</script>

{#if isOpen}
	<div role="dialog" class="bg-white shadow rounded-md p-4 flex flex-col">
		<h1 class="text-3xl mb-2 text-center">Congratulations!</h1>
		<p class="text-center text-lg mb-2">You finished the puzzle!</p>

		<div class="flex space-x-2 mx-auto my-4">
			<Input
				label="Solution Code:"
				bind:value={solutionCodeKey}
				placeholder="e.g. R1;C1"
				on:input={generateSolutionCode}
			/>
			<button title="Copy code to clipboard" on:click={copySolutionCode}
				><ClipboardText size={24} /></button
			>
		</div>

		<div class="flex space-x-2 mx-auto my-4">
			<p>Share:</p>
			<TwitterLink
				class="w-6 h-6 block"
				url="https://www.octopuzzles.com/sudoku/{sudokuId}"
				text="I solved this in {finishTime}, can you do better?"
				><TwitterLogo size={24} /></TwitterLink
			>

			<FacebookLink class="w-6 h-6 block" url="https://www.octopuzzles.com/sudoku/{sudokuId}"
				><FacebookLogo size={24} /></FacebookLink
			>

			<WhatsAppLink
				class="w-6 h-6 block"
				text="I solved this in {finishTime}, can you do better? https://www.octopuzzles.com/sudoku/{sudokuId}"
				><WhatsappLogo size={24} /></WhatsAppLink
			>

			<RedditLink
				class="w-6 h-6 block"
				text="I solved this in {finishTime}, can you do better?"
				url="https://www.octopuzzles.com/sudoku/{sudokuId}"><RedditLogo size={24} /></RedditLink
			>

			<button class="w-6 h-6 block" title="Take image of sudoku" on:click={takeScreenshot}
				><Image size={24} /></button
			>
		</div>

		<Button variant="primary" on:click={closeModal}>Okay</Button>
	</div>
{/if}
