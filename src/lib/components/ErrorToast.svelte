<script lang="ts">
  import type { AppError } from "../types.js";

  interface Props {
    errors: AppError[];
    onRemove: (timestamp: number) => void;
  }

  let { errors, onRemove }: Props = $props();

  function getErrorIcon(type: AppError["type"]) {
    switch (type) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
    }
  }

  function getErrorClass(type: AppError["type"]) {
    switch (type) {
      case "error":
        return "border-rose-pine-love bg-rose-pine-love/10";
      case "warning":
        return "border-rose-pine-gold bg-rose-pine-gold/10";
      case "info":
        return "border-rose-pine-foam bg-rose-pine-foam/10";
    }
  }
</script>

{#if errors.length > 0}
  <div class="fixed top-4 right-4 z-50 space-y-2">
    {#each errors as error (error.timestamp)}
      <div
        class="border rounded-lg p-3 text-sm max-w-sm {getErrorClass(
          error.type
        )} text-rose-pine-text backdrop-blur-sm"
      >
        <div class="flex items-start gap-2">
          <span class="flex-shrink-0">{getErrorIcon(error.type)}</span>
          <p class="flex-1">{error.message}</p>
          <button
            onclick={() => onRemove(error.timestamp)}
            class="text-rose-pine-muted hover:text-rose-pine-text flex-shrink-0"
          >
            ✕
          </button>
        </div>
      </div>
    {/each}
  </div>
{/if}
