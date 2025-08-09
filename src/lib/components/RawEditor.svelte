<script lang="ts">
  import Button from "./Button.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import {
    validateJsonWithDetails,
    formatJsonSafely,
    minifyJsonSafely,
  } from "../utils/json-validator.js";

  interface Props {
    content: string;
    onUpdate: (content: string) => void;
    onSave: () => void;
    onCancel: () => void;
  }

  let { content, onUpdate, onSave, onCancel }: Props = $props();

  let localContent = $state(content);
  let validationResult = $state(validateJsonWithDetails(content));
  let hasUnsavedChanges = $state(false);

  function handleContentChange(newContent: string) {
    localContent = newContent;
    hasUnsavedChanges = newContent !== content;
    validationResult = validateJsonWithDetails(newContent);
    onUpdate(newContent);
  }

  function formatJson() {
    if (validationResult.isValid && localContent.trim()) {
      const formatted = formatJsonSafely(localContent, 2);
      handleContentChange(formatted);
    }
  }

  function minifyJson() {
    if (validationResult.isValid && localContent.trim()) {
      const minified = minifyJsonSafely(localContent);
      handleContentChange(minified);
    }
  }

  function handleSave() {
    if (validationResult.isValid) {
      onSave();
      hasUnsavedChanges = false;
    }
  }

  function handleCancel() {
    onCancel();
    hasUnsavedChanges = false;
  }

  // Sync with external content changes - this is the key fix
  $effect(() => {
    localContent = content;
    validationResult = validateJsonWithDetails(content);
    hasUnsavedChanges = false;
  });
</script>

<div
  class="bg-rose-pine-surface rounded-lg border border-rose-pine-overlay overflow-hidden"
>
  <!-- Header -->
  <div
    class="flex items-center justify-between p-4 border-b border-rose-pine-overlay"
  >
    <div class="flex items-center gap-3">
      <h3 class="text-lg font-semibold text-rose-pine-text">Raw JSON Editor</h3>

      <!-- Validation status -->
      <div class="flex items-center gap-2">
        {#if validationResult.isValid}
          <span
            class="flex items-center gap-1 text-xs px-2 py-1 bg-rose-pine-foam/20 text-rose-pine-foam rounded"
          >
            ✓ Valid JSON
          </span>
        {:else}
          <span
            class="flex items-center gap-1 text-xs px-2 py-1 bg-rose-pine-love/20 text-rose-pine-love rounded"
          >
            ⚠ Invalid JSON
          </span>
        {/if}

        {#if hasUnsavedChanges}
          <span
            class="flex items-center gap-1 text-xs px-2 py-1 bg-rose-pine-gold/20 text-rose-pine-gold rounded"
          >
            • Unsaved
          </span>
        {/if}
      </div>
    </div>

    <div class="flex items-center gap-2">
      <!-- Format/Minify buttons -->
      {#if validationResult.isValid && localContent.trim()}
        <Button
          size="sm"
          variant="ghost"
          onclick={formatJson}
        >
          📐 Format
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onclick={minifyJson}
        >
          🗜️ Minify
        </Button>
        <div class="w-px h-4 bg-rose-pine-overlay"></div>
      {/if}

      <!-- Action buttons -->
      <Button
        size="sm"
        onclick={handleSave}
        disabled={!validationResult.isValid || !hasUnsavedChanges}
      >
        Apply Changes
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onclick={handleCancel}
      >
        Cancel
      </Button>
    </div>
  </div>

  <!-- Enhanced error display -->
  {#if !validationResult.isValid && validationResult.error}
    <div
      class="px-4 py-3 bg-rose-pine-love/10 border-b border-rose-pine-love/20"
    >
      <div class="flex items-start gap-3">
        <span class="flex-shrink-0 mt-0.5 text-rose-pine-love">⚠</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-rose-pine-love font-medium">
            JSON Syntax Error
          </p>
          <p class="text-sm text-rose-pine-text mt-1">
            {validationResult.error}
          </p>

          {#if validationResult.line && validationResult.column}
            <p class="text-xs text-rose-pine-muted mt-1">
              Line {validationResult.line}, Column {validationResult.column}
            </p>
          {/if}

          {#if validationResult.suggestion}
            <p class="text-xs text-rose-pine-foam mt-2 flex items-center gap-1">
              <span>💡</span>
              <span>{validationResult.suggestion}</span>
            </p>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Editor with syntax highlighting -->
  <div class="min-h-[400px] max-h-[600px]">
    <CodeMirror
      value={localContent}
      onchange={handleContentChange}
      placeholder="Enter JSON data..."
    />
  </div>

  <!-- Enhanced footer -->
  <div class="px-4 py-2 bg-rose-pine-base/50 border-t border-rose-pine-overlay">
    <div class="flex items-center justify-between text-xs text-rose-pine-muted">
      <div class="flex items-center gap-4">
        <span>Lines: {localContent.split("\n").length}</span>
        <span>Characters: {localContent.length}</span>
        {#if validationResult.isValid && localContent.trim()}
          <span>Size: {new Blob([localContent]).size} bytes</span>
        {/if}
      </div>
      <div class="flex items-center gap-2">
        <span>Ctrl+Z: Undo</span>
        <span>•</span>
        <span>Ctrl+Y: Redo</span>
        <span>•</span>
        <span>Ctrl+F: Find</span>
      </div>
    </div>
  </div>
</div>
