<script lang="ts">
  import Comments from '$components/comments/Comments.svelte';
  import { FacebookLink, RedditLink, TwitterLink, WhatsAppLink } from '@octopuzzles/ui';
  import { trpc } from '$lib/trpc/client';
  import type { Label } from '@octopuzzles/models';
  import type { Sudoku } from '@octopuzzles/models';
  import type { User } from '@octopuzzles/models';
  import type { Vote } from '@octopuzzles/models';
  import { PuzzleLabel, HTMLContent } from '@octopuzzles/ui';
  import classNames from 'classnames';
  import { formatDistanceToNowStrict } from 'date-fns';
  import CaretDown from 'phosphor-svelte/lib/CaretDown/CaretDown.svelte';
  import CaretUp from 'phosphor-svelte/lib/CaretUp/CaretUp.svelte';
  import Image from 'phosphor-svelte/lib/Image/Image.svelte';
  import { page } from '$app/stores';

  export let sudoku: Sudoku & {
    user?: Pick<User, 'id' | 'username' | 'role'> | null;
    userVote?: Vote | null;
    labels: Label[];
  };
  export let takeScreenshot: () => void;

  async function vote(value: number) {
    return await trpc($page).votes.vote.mutate({ sudokuId: sudoku.id, value });
  }

  $: pointsWithoutUserVote = (sudoku.points ?? 0) - (sudoku.userVote?.value ?? 0);

  let userVote = sudoku.userVote == null || sudoku.userVote.value === 0 ? 0 : sudoku.userVote.value;

  async function handleVote(value: 1 | -1): Promise<void> {
    if (sudoku.publicSince) {
      let newValue = userVote === value ? 0 : value;
      userVote = newValue; // optimistic
      const res = await vote(newValue);

      if (res) {
        userVote = res.value;
      }
    }
  }
</script>

<aside class="p-8">
  <div class="mb-4 flex flex-wrap space-y-4 space-x-4 items-center justify-between">
    <div class="flex items-center">
      <div class="flex flex-col text-sm text-gray-500 items-center">
        <button
          class={classNames(
            'w-8 h-8 transition-colors',
            { 'hover:text-orange-500 cursor-pointer': sudoku.publicSince != null },
            userVote > 0 && 'text-orange-500'
          )}
          on:click={() => handleVote(1)}
          disabled={sudoku.publicSince == null}
        >
          <CaretUp size={32} />
        </button>
        <p
          class={classNames('font-bold text-lg -my-2', {
            'text-orange-500': userVote !== 0
          })}
        >
          {pointsWithoutUserVote + userVote}
        </p>
        <button
          class={classNames(
            'w-8 h-8 transition-colors',
            { 'hover:text-orange-500 cursor-pointer': sudoku.publicSince != null },
            userVote < 0 && 'text-orange-500'
          )}
          on:click={() => handleVote(-1)}
          disabled={sudoku.publicSince == null}
        >
          <CaretDown size={32} />
        </button>
      </div>

      <div class="ml-4">
        <h1 class="text-3xl">{sudoku.title}</h1>
        <div class="text-gray-600 text-sm flex">
          <p>
            {#if sudoku.publicSince}
              Created {formatDistanceToNowStrict(sudoku.publicSince)} ago
            {/if}
            by
            {#if sudoku.user}
              <a
                class="font-semibold hover:underline hover:text-blue-500"
                href="/user/{sudoku.user.id}">{sudoku.user.username}</a
              >
            {:else}
              [DELETED]
            {/if}
            {#if sudoku.publicSince == null}
              -
              <span class="text-orange-500">NOT PUBLIC</span>
            {/if}
          </p>
        </div>
        {#if sudoku.labels}
          <div class="flex gap-2 pt-2">
            {#each sudoku.labels as label}
              <a href="/?label={label.id}">
                <PuzzleLabel {label} class="hover:bg-gray-200 transition-colors" />
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="flex space-x-2">
      <p>Share:</p>
      <TwitterLink
        class="w-6 h-6 block"
        url="https://www.octopuzzles.com/sudoku/{sudoku.id}"
        text="Can you solve this?"
      />

      <FacebookLink class="w-6 h-6 block" url="https://www.octopuzzles.com/sudoku/{sudoku.id}" />

      <WhatsAppLink
        class="w-6 h-6 block"
        text="Can you solve this? https://www.octopuzzles.com/sudoku/{sudoku.id}"
      />

      <RedditLink
        class="w-6 h-6 block"
        text="Can you solve this?"
        url="https://www.octopuzzles.com/sudoku/{sudoku.id}"
      />

      <button class="w-6 h-6 block" title="Take image of sudoku" on:click={takeScreenshot}
        ><Image size={24} /></button
      >
    </div>
  </div>

  <hr class="mb-4" />

  <HTMLContent content={sudoku.description} />

  {#if sudoku.solution == null}
    <p class="text-gray-800 text-sm mt-4">Info: No solution provided for this puzzle</p>
  {/if}

  <h2 class="mt-8 font-semibold mb-2">Comments</h2>
  <Comments sudokuId={sudoku.id} />
</aside>
