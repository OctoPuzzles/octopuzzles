<script lang="ts">
  import Comments from '$components/comments/Comments.svelte';
  import FacebookLink from '$components/shareButtons/FacebookLink.svelte';
  import RedditLink from '$components/shareButtons/RedditLink.svelte';
  import TwitterLink from '$components/shareButtons/TwitterLink.svelte';
  import WhatsAppLink from '$components/shareButtons/WhatsAppLink.svelte';
  import trpc from '$lib/client/trpc';
  import type { Label } from '$models/Label';
  import type { Sudoku } from '$models/Sudoku';
  import type { User } from '$models/User';
  import type { Vote } from '$models/Vote';
  import PuzzleLabel from '$ui/PuzzleLabel.svelte';
  import classNames from 'classnames';
  import { formatDistanceToNowStrict } from 'date-fns';
  import CaretDown from 'phosphor-svelte/lib/CaretDown/CaretDown.svelte';
  import CaretUp from 'phosphor-svelte/lib/CaretUp/CaretUp.svelte';
  import FacebookLogo from 'phosphor-svelte/lib/FacebookLogo/FacebookLogo.svelte';
  import Image from 'phosphor-svelte/lib/Image/Image.svelte';
  import RedditLogo from 'phosphor-svelte/lib/RedditLogo/RedditLogo.svelte';
  import TwitterLogo from 'phosphor-svelte/lib/TwitterLogo/TwitterLogo.svelte';
  import WhatsappLogo from 'phosphor-svelte/lib/WhatsappLogo/WhatsappLogo.svelte';
  import HtmlContent from '../HTMLContent.svelte';

  export let sudoku: Sudoku & {
    user?: Pick<User, 'id' | 'username' | 'role'> | null;
    userVote?: Vote | null;
    labels: Label[];
  };
  export let takeScreenshot: () => void;

  async function vote(value: number) {
    return await trpc().mutation('votes:vote', { sudokuId: sudoku.id, value });
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
        text="Can you solve this?"><TwitterLogo size={24} /></TwitterLink
      >

      <FacebookLink class="w-6 h-6 block" url="https://www.octopuzzles.com/sudoku/{sudoku.id}"
        ><FacebookLogo size={24} /></FacebookLink
      >

      <WhatsAppLink
        class="w-6 h-6 block"
        text="Can you solve this? https://www.octopuzzles.com/sudoku/{sudoku.id}"
        ><WhatsappLogo size={24} /></WhatsAppLink
      >

      <RedditLink
        class="w-6 h-6 block"
        text="Can you solve this?"
        url="https://www.octopuzzles.com/sudoku/{sudoku.id}"><RedditLogo size={24} /></RedditLink
      >

      <button class="w-6 h-6 block" title="Take image of sudoku" on:click={takeScreenshot}
        ><Image size={24} /></button
      >
    </div>
  </div>

  <hr class="mb-4" />

  <HtmlContent content={sudoku.description} />

  {#if sudoku.solution == null}
    <p class="text-gray-800 text-sm mt-4">Info: No solution provided for this puzzle</p>
  {/if}

  <h2 class="mt-8 font-semibold mb-2">Comments</h2>
  <Comments sudokuId={sudoku.id} />
</aside>
