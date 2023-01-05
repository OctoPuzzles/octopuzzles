<script lang="ts">
	import { colors } from '$constants';
	import type { Color } from '$models/Sudoku';
	import capitalize from '$utils/capitalize';

	import classNames from 'classnames';
	import Select from './Select.svelte';

	let className = '';
	export let color: Color | 'NONE';
	export let icons = true;
	export let allowNone = false;
	export let onChange: ((option: Color | 'NONE') => void) | undefined = undefined;

	export { className as class };
</script>

<Select
	options={allowNone ? ['NONE', ...colors] : colors}
	bind:option={color}
	class={classNames(className)}
	{onChange}
>
	<svelte:fragment slot="label">Color</svelte:fragment>
	<div slot="option" let:option class="flex items-center w-full gap-2">
		{#if icons}
			{#if option.toLowerCase() === 'white'}
				<div class="w-4 h-4 border border-gray-300 bg-{option.toLowerCase()}-500 rounded-lg" />
			{:else}
				<div class="w-4 h-4 bg-{option.toLowerCase()}-500 rounded-lg" />
			{/if}
		{/if}
		<p>{capitalize(option)}</p>
	</div>
</Select>
