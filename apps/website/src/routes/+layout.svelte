<script lang="ts">
  import '../app.css';
  import Header from '$components/Header/index.svelte';
  import Footer from '$components/Footer.svelte';
  import Modal from '$ui/Modal.svelte';
</script>

<Modal />
<Header />
<slot />
<Footer />
