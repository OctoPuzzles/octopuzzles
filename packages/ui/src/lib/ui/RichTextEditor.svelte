<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import TextHOne from 'phosphor-svelte/lib/TextHOne/TextHOne.svelte';
  import TextHTwo from 'phosphor-svelte/lib/TextHTwo/TextHTwo.svelte';
  import TextT from 'phosphor-svelte/lib/TextT/TextT.svelte';
  import TextBolder from 'phosphor-svelte/lib/TextBolder/TextBolder.svelte';
  import TextItalic from 'phosphor-svelte/lib/TextItalic/TextItalic.svelte';
  import ListBullets from 'phosphor-svelte/lib/ListBullets/ListBullets.svelte';
  import ListNumbers from 'phosphor-svelte/lib/ListNumbers/ListNumbers.svelte';
  import TextStrikethrough from 'phosphor-svelte/lib/TextStrikethrough/TextStrikethrough.svelte';
  import Placeholder from '@tiptap/extension-placeholder';

  export let content: string;
  export let placeholder = '';
  export let onChange: ((html: string) => void) | undefined = undefined;

  let element: HTMLDivElement;
  let editor: Editor;

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [StarterKit, Placeholder.configure({ placeholder })],
      content,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      }
    });

    editor.on('update', ({ editor }) => {
      const html = editor.getHTML();
      content = html;
      onChange?.(html);
    });
  });

  onDestroy(() => {
    if (editor != null) {
      editor.destroy();
    }
  });

  export const setRichEditorContent = (newContent: string): void => {
    editor?.commands.setContent(newContent);
    content = newContent;
  };
</script>

<div class="rich-text-editor h-full flex flex-col">
  {#if editor}
    <div class="flex mb-2">
      <div class="border-r pr-1 mr-1">
        <button
          tabindex={-1}
          class="rounded p-1 hover:bg-gray-100"
          type="button"
          on:click={() => editor.chain().focus().toggleBold().run()}
          class:active={editor.isActive('bold')}
        >
          <TextBolder />
        </button>
        <button
          tabindex={-1}
          class="rounded p-1 hover:bg-gray-100"
          type="button"
          on:click={() => editor.chain().focus().toggleItalic().run()}
          class:active={editor.isActive('italic')}
        >
          <TextItalic />
        </button>
        <button
          tabindex={-1}
          class="rounded p-1 hover:bg-gray-100"
          type="button"
          on:click={() => editor.chain().focus().toggleStrike().run()}
          class:active={editor.isActive('strike')}
        >
          <TextStrikethrough />
        </button>
      </div>

      <div>
        <button
          tabindex={-1}
          class="rounded p-1 hover:bg-gray-100"
          type="button"
          on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          class:active={editor.isActive('heading', { level: 1 })}
        >
          <TextHOne />
        </button>
        <button
          tabindex={-1}
          class="rounded p-1 hover:bg-gray-100"
          type="button"
          on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          class:active={editor.isActive('heading', { level: 2 })}
        >
          <TextHTwo />
        </button>
        <button
          tabindex={-1}
          class="rounded p-1 hover:bg-gray-100"
          type="button"
          on:click={() => editor.chain().focus().setParagraph().run()}
          class:active={editor.isActive('paragraph')}
        >
          <TextT />
        </button>

        <button
          tabindex={-1}
          class="rounded p-1 hover:bg-gray-100"
          type="button"
          on:click={() => editor.chain().focus().toggleBulletList().run()}
          class:active={editor.isActive('bulletList')}
        >
          <ListBullets />
        </button>
        <button
          tabindex={-1}
          class="rounded p-1 hover:bg-gray-100"
          type="button"
          on:click={() => editor.chain().focus().toggleOrderedList().run()}
          class:active={editor.isActive('orderedList')}
        >
          <ListNumbers />
        </button>
      </div>
    </div>
  {/if}

  <div bind:this={element} class="flex-1" />
</div>

<style>
  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  :global(.ProseMirror) {
    padding: 0.5rem;
    height: 100%;
    min-height: 10rem;
  }

  :global(.ProseMirror ul),
  :global(.ProseMirror ol) {
    padding-left: 1.5rem;
  }

  :global(.rich-text-editor button.active) {
    @apply bg-black text-white;
  }

  :global(.rich-text-editor ul) {
    @apply list-disc list-outside;
  }

  :global(.rich-text-editor ol) {
    @apply list-decimal list-outside;
  }
</style>
