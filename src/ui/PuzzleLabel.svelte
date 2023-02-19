<script lang="ts">
	import type { Label } from '$models/Label';
	import classNames from 'classnames';

	export let label: Label;
	let className = '';
	export { className as class };
	/** Specify if the tag is selected or not. Keep undefined, if the label is not interactive */
	export let selected: boolean | undefined = undefined;
</script>

<span
	class={classNames(
		'rounded-full text-sm px-2 py-1 whitespace-nowrap bg-gray-300 select-none',
		selected != null &&
			'hover:ring-1 hover:ring-orange-500 active:bg-orange-300 transition-colors cursor-pointer',
		{
			'!bg-orange-300': selected === true,
			'bg-gray-300': selected === false
		},
		className
	)}
	title={label.description}>{label.name}</span
>
