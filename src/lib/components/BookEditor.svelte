<script lang="ts">
  import Button from "./Button.svelte";
  import type { Book } from "../types.js";

  interface Props {
    books: Book[];
    onUpdate: (index: number, book: Book) => void;
    onAdd: (book: Book) => void;
    onRemove: (index: number) => void;
  }

  let { books, onUpdate, onAdd, onRemove }: Props = $props();

  let showAddForm = $state(false);
  let newBook = $state<Book>({
    id: "",
    title: "",
    author: "",
    genres: [],
    tags: [],
    rating: 0,
    status: "",
    description: "",
    myThoughts: "",
    links: [],
    coverImage: "",
    explicit: false,
    color: "",
  });

  function handleAdd() {
    onAdd({ ...newBook, id: Date.now().toString() });
    resetNewBook();
    showAddForm = false;
  }

  function resetNewBook() {
    newBook = {
      id: "",
      title: "",
      author: "",
      genres: [],
      tags: [],
      rating: 0,
      status: "",
      description: "",
      myThoughts: "",
      links: [],
      coverImage: "",
      explicit: false,
      color: "",
    };
  }

  function updateArrayField(value: string): string[] {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-rose-pine-text">
      Books ({books.length})
    </h3>
    <Button
      onclick={async () => {
        showAddForm = !showAddForm;
      }}
    >
      {showAddForm ? "Cancel" : "Add Book"}
    </Button>
  </div>

  {#if showAddForm}
    <div
      class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
    >
      <h4 class="font-medium text-rose-pine-text mb-3">Add New Book</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          bind:value={newBook.title}
          placeholder="Title"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newBook.author}
          placeholder="Author"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          value={newBook.genres.join(", ")}
          oninput={(e) =>
            (newBook.genres = updateArrayField(e.currentTarget.value))}
          placeholder="Genres (comma-separated)"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          value={newBook.tags.join(", ")}
          oninput={(e) =>
            (newBook.tags = updateArrayField(e.currentTarget.value))}
          placeholder="Tags (comma-separated)"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newBook.rating}
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Rating"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newBook.status}
          placeholder="Status"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newBook.coverImage}
          placeholder="Cover Image URL"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newBook.color}
          placeholder="Color"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <label class="flex items-center gap-2 text-rose-pine-text">
          <input
            bind:checked={newBook.explicit}
            type="checkbox"
            class="w-4 h-4 text-rose-pine-iris bg-rose-pine-base border-rose-pine-overlay rounded focus:ring-rose-pine-iris focus:ring-2"
          />
          Explicit Content
        </label>
      </div>
      <div class="mt-4 space-y-3">
        <textarea
          bind:value={newBook.description}
          placeholder="Description"
          rows="3"
          class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris resize-none"
        ></textarea>
        <textarea
          bind:value={newBook.myThoughts}
          placeholder="My Thoughts"
          rows="3"
          class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris resize-none"
        ></textarea>
      </div>
      <div class="mt-4 flex gap-2">
        <Button
          onclick={handleAdd}
          disabled={!newBook.title.trim() || !newBook.author.trim()}
        >
          Add Book
        </Button>
        <Button
          variant="secondary"
          onclick={() => {
            showAddForm = false;
            resetNewBook();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  {/if}

  <div class="space-y-3 max-h-96 overflow-y-auto rose-pine-scrollbar">
    {#each books as book, index}
      <div
        class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              {#if book.coverImage}
                <img
                  src={book.coverImage}
                  alt={book.title}
                  class="w-12 h-16 object-cover rounded"
                />
              {/if}
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-rose-pine-text truncate">
                  {book.title}
                </h4>
                <p class="text-sm text-rose-pine-muted truncate">
                  by {book.author}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    class="text-xs px-2 py-1 bg-rose-pine-iris/20 text-rose-pine-iris rounded"
                  >
                    ⭐ {book.rating}
                  </span>
                  <span
                    class="text-xs px-2 py-1 bg-rose-pine-foam/20 text-rose-pine-foam rounded"
                  >
                    {book.status}
                  </span>
                  {#if book.explicit}
                    <span
                      class="text-xs px-2 py-1 bg-rose-pine-love/20 text-rose-pine-love rounded"
                    >
                      Explicit
                    </span>
                  {/if}
                </div>
              </div>
            </div>
            {#if book.genres.length > 0}
              <div class="flex flex-wrap gap-1 mb-2">
                {#each book.genres as genre}
                  <span
                    class="text-xs px-2 py-1 bg-rose-pine-pine/20 text-rose-pine-pine rounded"
                  >
                    {genre}
                  </span>
                {/each}
              </div>
            {/if}
            {#if book.description}
              <p class="text-sm text-rose-pine-subtle line-clamp-2">
                {book.description}
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
