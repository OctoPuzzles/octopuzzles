<script lang="ts">
  import DangerActionModal from '$components/Modals/DangerActionModal.svelte';
  import RichTextEditor from '$components/RichTextEditor.svelte';
  import HtmlContent from '$components/HTMLContent.svelte';
  import type { InferQueryOutput } from '$lib/client/trpc';
  import trpc from '$lib/client/trpc';
  import { openModal } from '$stores/modalStore';
  import Button from '$ui/Button.svelte';
  import { formatDistanceToNowStrict } from 'date-fns';

  export let comment: InferQueryOutput<'comments:onSudoku'>['comments'][0];
  export let me: InferQueryOutput<'users:me'>;
  export let getComments: () => Promise<void>;

  let updatedContent: string | undefined = undefined;

  async function deleteComment(id: number) {
    openModal(DangerActionModal, {
      onAccept: async () => {
        await trpc().mutation('comments:delete', {
          id
        });
        await getComments();
      }
    });
  }
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
    <HtmlContent content={comment.body} />
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
        deleteComment(comment.id);
      }}>Delete</button
    >
  {/if}
</li>
