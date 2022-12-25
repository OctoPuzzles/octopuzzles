<script lang="ts">
  export let content: string;
</script>

<div class="html-description">
  <p class="whitespace-pre-line max-w-7xl">{@html content}</p>
</div>

<style global>
  .html-description ul,
  .html-description ol {
    padding-left: 1.5rem;
  }

  .html-description ul {
    @apply list-disc list-outside;
  }

  .html-description ol {
    @apply list-decimal list-outside;
  }
</style>
