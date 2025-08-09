<script lang="ts">
  import Button from "./Button.svelte";
  import type { GitHubConfig } from "../types.js";

  interface Props {
    onSave: (config: GitHubConfig) => void;
  }

  let { onSave }: Props = $props();

  let owner = $state("");
  let repo = $state("");
  let token = $state("");

  function handleSave() {
    if (!owner.trim() || !repo.trim() || !token.trim()) {
      return;
    }

    onSave({
      owner: owner.trim(),
      repo: repo.trim(),
      token: token.trim(),
    });
  }
</script>

<div
  class="bg-rose-pine-surface rounded-lg p-6 border border-rose-pine-overlay"
>
  <h2 class="text-xl font-semibold text-rose-pine-text mb-4">
    GitHub Configuration
  </h2>

  <div class="space-y-4">
    <div>
      <label
        for="owner"
        class="block text-sm font-medium text-rose-pine-text mb-1"
      >
        Repository Owner
      </label>
      <input
        id="owner"
        bind:value={owner}
        type="text"
        placeholder="username or organization"
        class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris focus:border-transparent"
      />
    </div>

    <div>
      <label
        for="repo"
        class="block text-sm font-medium text-rose-pine-text mb-1"
      >
        Repository Name
      </label>
      <input
        id="repo"
        bind:value={repo}
        type="text"
        placeholder="repository-name"
        class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris focus:border-transparent"
      />
    </div>

    <div>
      <label
        for="token"
        class="block text-sm font-medium text-rose-pine-text mb-1"
      >
        GitHub Personal Access Token
      </label>
      <input
        id="token"
        bind:value={token}
        placeholder="ghp_xxxxxxxxxxxx"
        class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris focus:border-transparent"
      />
      <p class="text-xs text-rose-pine-muted mt-1">
        Token needs 'Contents' write permission for repository access.
      </p>
    </div>

    <Button
      onclick={handleSave}
    >
      Save Configuration
    </Button>
  </div>
</div>
