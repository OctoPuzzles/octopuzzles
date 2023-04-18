<script lang="ts">
  import DangerActionModal from '$components/Modals/DangerActionModal.svelte';
  import { trpc } from '$lib/trpc/client';
  import type { RouterOutputs } from '$lib/trpc/router';
  import { Button, RichTextEditor, HTMLContent } from '@octopuzzles/ui';
  import { formatDistanceToNowStrict } from 'date-fns';
  import { page } from '$app/stores';

  export let comment: RouterOutputs['comments']['onSudoku']['comments'][0];
  export let me: RouterOutputs['users']['me'];
  export let getComments: () => Promise<void>;

  let updatedContent: string | undefined = undefined;

  let showDeleteCommentModal = false;

  async function updateComment(): Promise<void> {
    if (updatedContent != null) {
      await trpc($page).comments.update.mutate({
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
    await trpc($page).comments.delete.mutate({
      id: comment.id
    });
    await getComments();
  }}
/>
