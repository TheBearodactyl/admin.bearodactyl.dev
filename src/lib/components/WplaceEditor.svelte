<script lang="ts">
  import Button from "./Button.svelte";
  import type { WplaceScreenshot } from "../types";

  interface Props {
    screenshots: WplaceScreenshot[];
    onUpdate: (index: number, funnyimg: WplaceScreenshot) => void;
    onAdd: (funnyimg: WplaceScreenshot) => void;
    onRemove: (index: number) => void;
  }

  let { screenshots: funnyimgs, onUpdate, onAdd, onRemove }: Props = $props();

  let showAddForm = $state(false);
  let newFunnyImg = $state<WplaceScreenshot>({
    coverImage: "",
    alt: "",
  });
  let editingIndex = $state<number | null>(null);
  let editingImg = $state<WplaceScreenshot>({ coverImage: "", alt: "" });
  let imagePreviewErrors = $state<Set<number>>(new Set());

  function handleAdd() {
    if (
      newFunnyImg.coverImage &&
      newFunnyImg.coverImage.trim() &&
      newFunnyImg.alt
    ) {
      onAdd({ ...newFunnyImg });
      resetNewFunnyImg();
      showAddForm = false;
    }
  }

  function resetNewFunnyImg() {
    newFunnyImg = {
      coverImage: "",
      alt: "",
    };
  }

  function startEditing(index: number) {
    editingIndex = index;
    editingImg = { ...funnyimgs[index] };
  }

  function saveEdit() {
    if (
      editingIndex !== null &&
      editingImg.coverImage &&
      editingImg.coverImage.trim() &&
      editingImg.alt
    ) {
      onUpdate(editingIndex, { ...editingImg });
      cancelEdit();
    }
  }

  function cancelEdit() {
    editingIndex = null;
    editingImg = { coverImage: "", alt: "" };
  }

  function handleImageError(index: number) {
    imagePreviewErrors = new Set([...imagePreviewErrors, index]);
  }

  function handleImageLoad(index: number) {
    const newErrors = new Set(imagePreviewErrors);
    newErrors.delete(index);
    imagePreviewErrors = newErrors;
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {});
  }

  let selectedItems = $state<Set<number>>(new Set());
  let showBulkActions = $derived(selectedItems.size > 0);

  function toggleSelection(index: number) {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    selectedItems = newSelection;
  }

  function selectAll() {
    selectedItems = new Set(funnyimgs.map((_, index) => index));
  }

  function clearSelection() {
    selectedItems = new Set();
  }

  function bulkRemove() {
    const sortedIndices = Array.from(selectedItems).sort((a, b) => b - a);
    sortedIndices.forEach((index) => onRemove(index));
    clearSelection();
  }
</script>

<div class="space-y-4">
  <!-- Header with bulk actions -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h3 class="text-lg font-semibold text-rose-pine-text">
        Funny Images ({funnyimgs.length})
      </h3>

      {#if showBulkActions}
        <div class="flex items-center gap-2 text-sm">
          <span class="text-rose-pine-muted">{selectedItems.size} selected</span
          >
          <Button
            size="sm"
            variant="danger"
            onclick={bulkRemove}
          >
            Remove Selected
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onclick={clearSelection}
          >
            Clear
          </Button>
        </div>
      {/if}
    </div>

    <div class="flex gap-2">
      {#if funnyimgs.length > 0}
        <Button
          size="sm"
          variant="ghost"
          onclick={selectAll}
        >
          Select All
        </Button>
      {/if}
      <Button
        onclick={() => {
          showAddForm = !showAddForm;
        }}
      >
        {showAddForm ? "Cancel" : "Add Image"}
      </Button>
    </div>
  </div>

  {#if showAddForm}
    <div
      class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
    >
      <h4 class="font-medium text-rose-pine-text mb-3">Add New Funny Image</h4>
      <div class="space-y-3">
        <div>
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="block text-sm font-medium text-rose-pine-text mb-1">
            Image URL
          </label>
          <input
            bind:value={newFunnyImg.coverImage}
            type="url"
            placeholder="https://example.com/funny-image.jpg"
            class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
          />
          {#if newFunnyImg.coverImage && !isValidUrl(newFunnyImg.coverImage)}
            <p class="text-xs text-rose-pine-love mt-1">
              Please enter a valid URL
            </p>
          {/if}
        </div>

        <div>
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="block text-sm font-medium text-rose-pine-text mb-1">
            Alt Text
          </label>
          <input
            bind:value={newFunnyImg.alt}
            placeholder="Describe the image for accessibility"
            class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
          />
        </div>

        <!-- Preview -->
        {#if newFunnyImg.coverImage && isValidUrl(newFunnyImg.coverImage)}
          <div class="mt-3">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label class="block text-sm font-medium text-rose-pine-text mb-2"
              >Preview</label
            >
            <div class="max-w-xs">
              <img
                src={newFunnyImg.coverImage}
                alt={newFunnyImg.alt}
                class="max-w-full h-auto rounded border border-rose-pine-overlay"
                onerror={() => {
                  /* Handle preview error */
                }}
                onload={() => {
                  /* Handle successful load */
                }}
              />
            </div>
          </div>
        {/if}

        <div class="flex gap-2 pt-2">
          <Button onclick={handleAdd}>Add Image</Button>
          <Button
            variant="secondary"
            onclick={() => {
              showAddForm = false;
              resetNewFunnyImg();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Images grid -->
  <div class="space-y-3 max-h-96 overflow-y-auto rose-pine-scrollbar">
    {#if funnyimgs.length === 0}
      <div class="text-center py-8 text-rose-pine-muted">
        <div class="text-4xl mb-2">🖼️</div>
        <p>No funny images yet!</p>
        <p class="text-sm mt-1">Add your first image to get started.</p>
      </div>
    {:else}
      {#each funnyimgs as img, index}
        <div
          class="bg-rose-pine-surface rounded-lg border border-rose-pine-overlay overflow-hidden"
        >
          <div class="flex items-start gap-4 p-4">
            <!-- Selection checkbox -->
            <label class="flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={selectedItems.has(index)}
                onchange={() => toggleSelection(index)}
                class="w-4 h-4 text-rose-pine-iris bg-rose-pine-base border-rose-pine-overlay rounded focus:ring-rose-pine-iris focus:ring-2"
              />
            </label>

            <!-- Image preview -->
            <div
              class="flex-shrink-0 w-24 h-24 bg-rose-pine-base rounded border border-rose-pine-overlay flex items-center justify-center overflow-hidden"
            >
              {#if imagePreviewErrors.has(index)}
                <div class="text-rose-pine-love text-xs text-center p-2">
                  <div class="text-lg">❌</div>
                  <div>Failed to load</div>
                </div>
              {:else}
                <img
                  src={img.coverImage}
                  alt={img.alt}
                  class="w-full h-full object-cover"
                  onerror={() => handleImageError(index)}
                  onload={() => handleImageLoad(index)}
                />
              {/if}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              {#if editingIndex === index}
                <!-- Edit form -->
                <div class="space-y-3">
                  <input
                    bind:value={editingImg.coverImage}
                    type="url"
                    placeholder="Image URL"
                    class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris text-sm"
                  />
                  <input
                    bind:value={editingImg.alt}
                    placeholder="Alt text"
                    class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris text-sm"
                  />
                  <div class="flex gap-2">
                    <Button
                      size="sm"
                      onclick={saveEdit}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onclick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              {:else}
                <!-- Display mode -->
                <div class="space-y-2">
                  <div class="flex items-start gap-2">
                    <span
                      class="text-xs px-2 py-1 bg-rose-pine-foam/20 text-rose-pine-foam rounded flex-shrink-0"
                    >
                      IMG #{index + 1}
                    </span>
                  </div>

                  <div class="space-y-1">
                    <p class="text-sm text-rose-pine-text font-medium">
                      Alt: {img.alt}
                    </p>
                    <div class="flex items-center gap-2">
                      <a
                        href={img.coverImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-xs text-rose-pine-foam hover:underline truncate max-w-xs"
                      >
                        {img.coverImage}
                      </a>
                      <button
                        onclick={() => copyToClipboard(img.coverImage)}
                        class="text-xs text-rose-pine-muted hover:text-rose-pine-text p-1 rounded"
                        title="Copy URL"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Actions -->
            <div class="flex-shrink-0 flex gap-1">
              {#if editingIndex !== index}
                <Button
                  size="sm"
                  variant="ghost"
                  onclick={() => startEditing(index)}
                >
                  Edit
                </Button>
              {/if}
              <Button
                size="sm"
                variant="danger"
                onclick={() => onRemove(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Stats footer -->
  {#if funnyimgs.length > 0}
    <div
      class="text-xs text-rose-pine-muted text-center py-2 border-t border-rose-pine-overlay"
    >
      Total: {funnyimgs.length} image{funnyimgs.length !== 1 ? "s" : ""}
      {#if selectedItems.size > 0}
        • {selectedItems.size} selected
      {/if}
    </div>
  {/if}
</div>
