<script lang="ts">
	export let url: string;
	export let text: string;
	let className = '';
	export { className as class };
</script>

<a
	class={className}
	title="Reddit"
	href="https://www.reddit.com/submit?url={url}&title={text}"
	target="_blank"
	rel="noreferrer noopener"
>
	<slot />
</a>
