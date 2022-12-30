<script lang="ts">
	import classNames from 'classnames';
	import Label from './Label.svelte';

	let className = '';
	export let label = '';
	export let id = '';
	export let value: string;

	export { className as class };
</script>

{#if label}
	<Label {id}>
		{label}
	</Label>
{/if}
<!-- svelte-ignore a11y-no-onchange -->
<select
	{...$$props}
	bind:value
	{id}
	on:change
	class={classNames(
		'relative block rounded-lg text-black border border-gray-300 py-1 px-4 cursor-pointer text-base',
		className
	)}
>
	<slot />
</select>

<style>
	select {
		appearance: none;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='grey' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		background-size: 16px 12px;
	}
</style>
