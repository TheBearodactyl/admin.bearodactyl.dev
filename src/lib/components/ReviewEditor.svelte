<script lang="ts">
  import Button from "./Button.svelte";
  import type { Review } from "../types.js";

  interface Props {
    reviews: Review[];
    onUpdate: (index: number, review: Review) => void;
    onAdd: (review: Review) => void;
    onRemove: (index: number) => void;
  }

  let { reviews, onUpdate, onAdd, onRemove }: Props = $props();

  let showAddForm = $state(false);
  let newReview = $state<Review>({
    chapter: 0,
    description: "",
    rating: 0,
    thoughts: "",
  });

  function handleAdd() {
    onAdd({ ...newReview });
    resetNewReview();
    showAddForm = false;
  }

  function resetNewReview() {
    newReview = {
      chapter: 0,
      description: "",
      rating: 0,
      thoughts: "",
    };
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-rose-pine-text">
      Reviews ({reviews.length})
    </h3>
    <Button
      onclick={() => {
        showAddForm = !showAddForm;
      }}
    >
      {showAddForm ? "Cancel" : "Add Review"}
    </Button>
  </div>

  {#if showAddForm}
    <div
      class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
    >
      <h4 class="font-medium text-rose-pine-text mb-3">Add New Review</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          bind:value={newReview.chapter}
          type="number"
          min="1"
          placeholder="Chapter Number"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newReview.rating}
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Rating"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
      </div>
      <div class="mt-4 space-y-3">
        <textarea
          bind:value={newReview.description}
          placeholder="Description"
          rows="3"
          class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris resize-none"
        ></textarea>
        <textarea
          bind:value={newReview.thoughts}
          placeholder="Thoughts (optional)"
          rows="3"
          class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris resize-none"
        ></textarea>
      </div>
      <div class="mt-4 flex gap-2">
        <Button
          onclick={handleAdd}
          disabled={!newReview.description.trim() || newReview.chapter < 1}
        >
          Add Review
        </Button>
        <Button
          variant="secondary"
          onclick={() => {
            showAddForm = false;
            resetNewReview();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  {/if}

  <div class="space-y-3 max-h-96 overflow-y-auto rose-pine-scrollbar">
    {#each reviews as review, index}
      <div
        class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span
                class="text-xs px-2 py-1 bg-rose-pine-foam/20 text-rose-pine-foam rounded"
              >
                Chapter {review.chapter}
              </span>
              <span
                class="text-xs px-2 py-1 bg-rose-pine-iris/20 text-rose-pine-iris rounded"
              >
                ⭐ {review.rating}
              </span>
            </div>
            <p class="text-sm text-rose-pine-text mb-2">{review.description}</p>
            {#if review.thoughts}
              <p class="text-sm text-rose-pine-subtle italic">
                "{review.thoughts}"
              </p>
            {/if}
          </div>
          <Button
            size="sm"
            variant="danger"
            onclick={() => onRemove(index)}
          >
            Remove
          </Button>
        </div>
      </div>
    {/each}
  </div>
</div>
