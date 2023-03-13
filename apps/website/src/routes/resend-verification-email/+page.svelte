<script lang="ts">
  import Input from '$ui/Input.svelte';
  import Button from '$ui/Button.svelte';
  import trpc from '$lib/client/trpc';

  let email = '';

  let error = '';

  let successful = false;

  async function resendVerificationEmail() {
    return await trpc().mutation('users:resend-verification', { email });
  }

  async function requestNewVerificationToken(): Promise<void> {
    try {
      await resendVerificationEmail();

      successful = true;
    } catch (_) {
      error = 'Something went wrong';
    }
  }
</script>

<div class="p-4 container mx-auto">
  {#if successful}
    <p>
      We have sent you a new verification email. It might take a little while before it appears in
      your inbox
    </p>
  {:else}
    <h1 class="text-center text-xl">
      Type in your email, and we will send a new verification email
    </h1>
    <form>
      <Input bind:value={email} label="Email" placeholder="email" required>
        <p slot="error">{error}</p>
      </Input>

      <Button type="button" variant="primary" class="mt-4" on:click={requestNewVerificationToken}>
        Send new verification email
      </Button>
    </form>
  {/if}
</div>
