<script lang="ts">
  import DangerActionModal from '$components/Modals/DangerActionModal.svelte';
  import type { InferQueryOutput } from '$lib/client/trpc';
  import trpc from '$lib/client/trpc';
  import { Button, RichTextEditor, HTMLContent } from '@octopuzzles/ui';
  import { formatDistanceToNowStrict } from 'date-fns';

  export let comment: InferQueryOutput<'comments:onSudoku'>['comments'][0];
  export let me: InferQueryOutput<'users:me'>;
  export let getComments: () => Promise<void>;

  let updatedContent: string | undefined = undefined;

  let showDeleteCommentModal = false;

  async function updateComment() {
    if (updatedContent != null) {
      await trpc().mutation('comments:update', {
        id: comment.id,
        body: updatedContent
      });
      updatedContent = undefined;
      await getComments();
    }
  }
</script>

<li class="rounded-lg shadow border p-2">
  <div class="flex gap-2 items-center mb-2">
    <h6 class="font-semibold">{comment.user.username}</h6>
    <span class="text-sm text-gray-500"
      >created {formatDistanceToNowStrict(comment.createdAt)} ago</span
    >
  </div>
  {#if updatedContent == null}
    <HTMLContent content={comment.body} />
  {:else}
    <RichTextEditor bind:content={updatedContent} placeholder="Update comment" />
    <div class="w-full justify-end gap-2">
      <Button on:click={() => (updatedContent = undefined)}>Cancel</Button>
      <Button on:click={() => updateComment()}>Save</Button>
    </div>
  {/if}
  {#if me != null && me.id === comment.user.id}
    <button class="text-sm text-gray-500" on:click={() => (updatedContent = comment.body)}
      >Update</button
    ><span class="mx-1">•</span>
    <button
      class="text-sm text-gray-500"
      on:click={() => {
        showDeleteCommentModal = true;
      }}>Delete</button
    >
  {/if}
</li>

<DangerActionModal
  bind:isOpen={showDeleteCommentModal}
  onAccept={async () => {
    await trpc().mutation('comments:delete', {
      id: comment.id
    });
    await getComments();
  }}
/>
