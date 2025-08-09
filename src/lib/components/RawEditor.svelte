<script lang="ts">
  import Button from "./Button.svelte";

  interface Props {
    content: string;
    onUpdate: (content: string) => void;
    onSave: () => void;
    onCancel: () => void;
  }

  let { content, onUpdate, onSave, onCancel }: Props = $props();
</script>

<div
  class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
>
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-rose-pine-text">Raw JSON Editor</h3>
    <div class="flex gap-2">
      <Button
        size="sm"
        onclick={onSave}>Apply Changes</Button
      >
      <Button
        size="sm"
        variant="secondary"
        onclick={onCancel}>Cancel</Button
      >
    </div>
  </div>

  <textarea
    bind:value={content}
    oninput={(e) => onUpdate(e.currentTarget.value)}
    class="w-full h-96 px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-pine-iris focus:border-transparent rose-pine-scrollbar"
    placeholder="Enter JSON data..."
  ></textarea>
</div>
