<script lang="ts">
	export let content: string;
</script>

<div class="html-description">
	<p class="whitespace-pre-line max-w-7xl">{@html content}</p>
</div>

<style>
	:global(.html-description ul),
	:global(.html-description ol) {
		padding-left: 1.5rem;
	}

	:global(.html-description ul) {
		@apply list-disc list-outside;
	}

	:global(.html-description ol) {
		@apply list-decimal list-outside;
	}
</style>
