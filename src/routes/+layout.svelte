<script lang="ts">
  import '../app.css';
  import { appState } from '$lib/stores/app-state.svelte.js';
  import Header from '$lib/components/Header.svelte';
  import ErrorToast from '$lib/components/ErrorToast.svelte';

  let { children } = $props();
</script>

<div class="min-h-screen bg-rose-pine-base">
  <Header title="Rose Pine Admin Panel" />
  <main class="container mx-auto px-4 py-6">
    {@render children()}
  </main>
  <ErrorToast 
    errors={appState.state.errors} 
    onRemove={appState.removeError} 
  />
</div>