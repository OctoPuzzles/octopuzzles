<script lang="ts">
	import classNames from 'classnames';

	type T = $$Generic;

	export let name: string;
	export let value: T;
	export let options: T[];
	export let idFromOption: (option: T) => string;

	export let onChange: ((option: T) => void) | undefined = undefined;
</script>

<fieldset class="flex rounded-md w-full h-8 space-x-px bg-gray-200 p-px">
	{#each options as option, i}
		{@const isFirst = i === 0}
		{@const isLast = i === options.length - 1}
		<div class="h-full grow basis-full">
			<input
				id={idFromOption(option)}
				class="absolute opacity-0 w-0 h-0 peer"
				type="radio"
				{name}
				on:mouseup={() => {
					value = option;
					onChange?.(option);
				}}
				value={option}
			/>
			<label
				for={idFromOption(option)}
				class={classNames(
					'h-full w-full peer-focus:ring-2 relative bg-white flex cursor-pointer focus:outline-none peer-checked:text-blue-500 peer-checked:ring peer-checked:ring-blue-500 peer-checked:z-10',
					isFirst && 'rounded-l-md',
					isLast && 'rounded-r-md'
				)}
				on:mouseup={() => {
					value = option;
					onChange?.(option);
				}}
			>
				<slot {option} />
			</label>
		</div>
	{/each}
</fieldset>
