<script lang="ts">
	import { useId } from '$utils/useId';

	import classNames from 'classnames';
	import { tick } from 'svelte';
	import Label from './Label.svelte';

	type T = $$Generic;

	/**
	 * A list of options to select from
	 */
	export let options: T[];
	/**
	 * The selected option. bind to this, i.e. bind:option
	 */
	export let option: T | undefined = undefined;
	let className = '';
	export { className as class };

	let id = useId();
	let focused = false;
	let button: HTMLButtonElement;
	let list: HTMLUListElement;
	let selected = -1;

	$: {
		if (!focused && selected !== -1) {
			selected = -1;
		}
	}

	$: if (button && list) {
		// The list should have the same width as the button.
		// We do this with js, as I don't know how with css
		list.style.width = button.clientWidth + 'px';
	}

	async function handleKeyDown(e: KeyboardEvent): Promise<void> {
		switch (e.key) {
			case 'Escape':
				button.blur();
				break;
			case 'Enter':
				option = options[selected];
				button.blur();
				break;
			case 'ArrowUp':
				if (selected !== -1) {
					selected = (selected - 1) % options.length;
				} else {
					selected = options.length - 1;
				}
				await tick();
				if (list) {
					const active = list.querySelector('[data-selected="true"]') as HTMLLIElement;
					if (active) {
						if (selected === options.length - 1) {
							list.scrollTop = active.offsetTop;
							return;
						}
						// 	suggested by Rplus
						if (active.offsetTop < list.scrollTop) {
							active.scrollIntoView();
						}
					}
				}

				break;
			case 'ArrowDown':
				if (selected !== -1) {
					selected = (selected + 1) % options.length;
				} else {
					selected = 0;
				}
				await tick();
				if (list) {
					const active = list.querySelector('[data-selected="true"]') as HTMLLIElement;
					if (active) {
						if (selected === 0) {
							list.scrollTop = 0;
							return;
						}
						// 						suggested by Rplus
						if (active.offsetTop + active.clientHeight > list.scrollTop + list.offsetHeight) {
							active.scrollIntoView();
						}
					}
				}

				break;
		}
	}
</script>

<!--
	@component
	Combobox. A select with input

		```tsx
		<script lang="ts">
			type Option = {
				item: string, 
				id: number
			};
			let options: Option[] = [{item: "item1", id: 1}, {item: "item2", id: 2}];
			let option: Option | undefined = undefined;
		</script>

		<Select
			options={options}
			valueFromOption={(o) => o.item}
			bind:option={option}
			{required}
		>
			<svelte:fragment slot="label">Account</svelte:fragment>
			<div slot="header">
				<p>Item</p>
				<p>Id</p>
			</div>
			<div slot="option" let:option>
				<p>{option.item}</p>
				<p>{option.id}</p>
			</div>
		</Select>
		```
-->

<div class={focused ? 'z-50' : 'z-0'}>
	<Label id="listbox-{id}"><slot name="label" /></Label>
	<div
		role="listbox"
		aria-expanded={focused}
		aria-owns="listbox-{id}"
		aria-haspopup="listbox"
		class="w-full"
	>
		<button
			aria-haspopup="listbox"
			class={classNames(
				'relative rounded-lg bg-white text-black border border-gray-300 py-1 px-4 cursor-pointer w-full text-left',
				className
			)}
			id="listbox-{id}"
			autocomplete="off"
			aria-autocomplete="list"
			aria-controls="listbox-{id}"
			aria-activedescendant={selected !== -1 ? `listbox-${id}-option-${selected}` : null}
			bind:this={button}
			on:keydown={handleKeyDown}
			type="button"
			on:focus={() => (focused = true)}
			on:blur={() => (focused = false)}
		>
			<slot name="option" {option} />
		</button>

		{#if focused}
			<ul
				bind:this={list}
				id="listbox-{id}"
				class="z-50 mt-1 block absolute overflow-y-auto max-h-64 rounded-lg ring-1 ring-gray-300 bg-white"
				role="listbox"
				tabindex={-1}
			>
				<div class="sticky top-0">
					<slot name="header" />
				</div>
				{#if options.length > 0}
					{#each options as d, i (d)}
						<!-- svelte-ignore a11y-role-has-required-aria-props -->
						<li
							id="listbox-{id}-option-{i}"
							role="option"
							aria-setsize={options.length}
							aria-posinset={i + 1}
							data-selected={selected === i}
							class="cursor-pointer w-full hover:bg-gray-100"
							on:mousedown={() => {
								option = d;
							}}
						>
							<slot name="option" option={d} />
						</li>
					{/each}
				{:else}
					<li>No results</li>
				{/if}
			</ul>
		{/if}
	</div>
</div>
