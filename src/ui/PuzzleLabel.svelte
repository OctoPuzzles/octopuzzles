<script lang="ts">
	import type { Label } from '$models/Label';
	import classNames from 'classnames';

	export let label: Label;
	let className = '';
	export { className as class };
</script>

<span
	class={classNames('rounded-full text-sm px-2 py-1 whitespace-nowrap bg-gray-300', className)}
	title={label.description}>{label.name}</span
>
