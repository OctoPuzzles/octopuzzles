<script lang="ts">
	import classNames from 'classnames';
	import CaretDown from 'phosphor-svelte/lib/CaretDown/CaretDown.svelte';
	import CaretUp from 'phosphor-svelte/lib/CaretUp/CaretUp.svelte';
	import Trash from 'phosphor-svelte/lib/Trash/Trash.svelte';

	export let isHighlighted: boolean;
	export let onHover: () => void;
	export let onHoverOut: () => void;
	export let onMoveUp: () => void;
	export let onMoveDown: () => void;
	export let onClick: () => void;
	export let onDelete: () => void;
</script>

<button
	class={classNames(
		'h-12 w-full flex rounded-md bg-white border border-gray-300 font-medium text-gray-700 overflow-hidden mb-2',
		{ 'border-blue-500': isHighlighted }
	)}
	on:mouseover={() => onHover()}
	on:focus={() => onHover()}
	on:mouseout={() => onHoverOut()}
	on:blur={() => onHoverOut()}
>
	<div class="h-full w-8 bg-gray-100 border-r border-gray-300">
		<div
			class="h-1/2 flex justify-center items-center hover:bg-gray-200 p-1 border-b border-gray-300"
			on:click={() => onMoveUp()}
			on:keypress={() => onMoveUp()}
		>
			<CaretUp size={16} />
		</div>
		<div
			class="h-1/2 flex justify-center items-center hover:bg-gray-200 p-1"
			on:click={() => onMoveDown()}
			on:keypress={() => onMoveDown()}
		>
			<CaretDown size={16} />
		</div>
	</div>
	<span
		class="hover:bg-gray-100 w-full h-full flex items-center justify-center"
		on:click={() => onClick()}
		on:keypress={() => onClick()}
	>
		<slot />
	</span>
	<div
		class="h-full w-8 p-1 flex justify-center items-center hover:bg-red-100 hover:text-red-500 border-l border-gray-300"
		on:click={() => onDelete()}
		on:keypress={() => onDelete()}
	>
		<Trash size={20} />
	</div>
</button>
