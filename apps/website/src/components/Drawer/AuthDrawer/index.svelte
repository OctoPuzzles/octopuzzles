<script lang="ts">
  import { authMode } from '$stores/authStore';
  import Drawer from '../index.svelte';
  import Login from './Modes/Login.svelte';
  import Signup from './Modes/Signup.svelte';
</script>

<Drawer
  onClose={() => {
    authMode.setAuthMode();
  }}
  open={!!$authMode}
>
  {#if $authMode === 'login'}
    <Login />
  {:else}
    <Signup />
  {/if}
</Drawer>
