<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import type { RouterOutputs } from '$lib/trpc/router';
  import { Button, RichTextEditor } from '@octopuzzles/ui';
  import { onMount } from 'svelte';
  import Comment from './Comment.svelte';
  import { page } from '$app/stores';

  export let sudokuId: number;

  let me: RouterOutputs['users']['me'];
  async function getMe() {
    me = await trpc($page).users.me.query();
  }

  onMount(() => {
    getComments();
    getMe();
  });

  let savingComment = false;
  let commentContent = '';

  async function postComment() {
    savingComment = true;
    await trpc($page).comments.create.mutate({
      body: commentContent,
      sudokuId: sudokuId
    });
    commentContent = '';
    savingComment = false;
    await getComments();
  }

  let currentCursor: Date | null | undefined = undefined;
  let comments: RouterOutputs['comments']['onSudoku']['comments'] = [];
  const limit = 20;
  async function getComments() {
    const c = await trpc($page).comments.onSudoku.query({
      sudokuId: sudokuId,
      limit,
      cursor: currentCursor ?? undefined
    });
    currentCursor = c.nextCursor;
    comments = c.comments;
  }
</script>

<ul class="space-y-2">
  {#if me != null}
    <li class="rounded-lg shadow border p-2">
      <h6>Write a new comment</h6>
      <RichTextEditor bind:content={commentContent} placeholder="New comment" />
      <div class="flex w-full justify-end mt-4">
        <Button
          loading={savingComment}
          variant="primary"
          on:click={() => {
            void postComment();
          }}>Save</Button
        >
      </div>
    </li>
  {/if}
  {#if comments.length > 0}
    {#each comments as comment}
      <Comment {comment} {getComments} {me} />
    {/each}
  {:else}
    <li class="text-gray-700 mt-2">No comments</li>
  {/if}
</ul>
