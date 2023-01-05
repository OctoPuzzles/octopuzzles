<script lang="ts">
	import type { Color } from '$models/Sudoku';
	import capitalize from '$utils/capitalize';
	import classNames from 'classnames';
	import Select from './Select.svelte';

	const colors: Color[] = [
		'Black',
		'White',
		'LightGray',
		'Gray',
		'Red',
		'Yellow',
		'Green',
		'Blue',
		'Orange',
		'Purple'
	];

	let className = '';
	export let color: Color | 'NONE';
	export let icons = true;
	export let allowNone = false;

	export { className as class };
</script>

<Select
	options={allowNone ? ['NONE', ...colors] : colors}
	bind:option={color}
	class={classNames(className)}
>
	<svelte:fragment slot="label">Color</svelte:fragment>
	<div slot="option" let:option class="flex items-center w-full py-1 px-2">
		{#if icons}
			{#if option.toLowerCase() === 'white'}
				<div class="w-4 h-4 border border-gray-300 bg-{option.toLowerCase()}-500 rounded-lg mr-1" />
			{:else}
				<div class="w-4 h-4 bg-{option.toLowerCase()}-500 rounded-lg mr-1" />
			{/if}
		{/if}
		<p class="ml-2">{capitalize(option)}</p>
	</div>
</Select>
