<script lang="ts">
	import classNames from 'classnames';
	import Button from './Button.svelte';
	import type Circle from '$icons/shapes/Circle.svelte';
	import type { Color, Rotation } from '$models/Sudoku';

	type IconData = {
		label?: string;
		icon?: typeof Circle;
		size?: number;
		color?: Color | 'NONE';
		border?: boolean;
		rotation?: Rotation;
	};
	function isIconData(labelOrIcon: string | IconData): labelOrIcon is IconData {
		if ((labelOrIcon as IconData).label || (labelOrIcon as IconData).icon) {
			return true;
		}
		return false;
	}

	/**
	 * Options (name, value pairs) in RadioGroup
	 */
	export let options: {
		[key: string]: string | IconData;
	};
	/**
	 * Current value of RadioGroup
	 */
	export let value: string | undefined;
	/**
	 * Function that fires onChange and takes new value as parameter
	 */
	export let onChange: ((value: string) => void) | undefined;

	$: entries = Object.entries(options);
</script>

<div
	tabIndex={0}
	class="flex rounded-sm w-full"
	on:focus={(e) => {
		// If a child element has been focused, ignore
		if (e.target !== e.currentTarget) {
			return;
		}
	}}
>
	{#each entries as [key, labelOrIcon], i (i)}
		<Button
			type="button"
			style="width: {(1 / entries.length) * 100}%"
			class={classNames({
				'rounded-l-none -ml-px border-l': i > 0,
				'rounded-r-none -mr-px': i < entries.length - 1
			})}
			variant={value === key ? 'secondary' : 'default'}
			on:click={() => {
				value = key;
				onChange?.(key);
			}}
		>
			{#if isIconData(labelOrIcon)}
				{#if labelOrIcon.icon}
					<svelte:component
						this={labelOrIcon.icon}
						size={labelOrIcon.size}
						color={labelOrIcon.color}
						border={(value === key && labelOrIcon.color === 'Blue') ||
						(value !== key && labelOrIcon.color === 'White')
							? true
							: labelOrIcon.border}
						rotation={labelOrIcon.rotation}
					/>
				{/if}
				{#if labelOrIcon.label}
					{labelOrIcon.label}
				{/if}
			{:else}
				{labelOrIcon}
			{/if}
		</Button>
	{/each}
</div>
