<script lang="ts">
  import Button from "./Button.svelte";
  import type { Game } from "../types.js";

  interface Props {
    games: Game[];
    onUpdate: (index: number, game: Game) => void;
    onAdd: (game: Game) => void;
    onRemove: (index: number) => void;
  }

  let { games, onUpdate, onAdd, onRemove }: Props = $props();

  let showAddForm = $state(false);
  let newGame = $state<Game>({
    id: "",
    title: "",
    developer: "",
    genres: [],
    tags: [],
    rating: 0,
    status: "",
    description: "",
    myThoughts: "",
    links: [],
    coverImage: "",
    explicit: false,
    percent: 0,
  });

  function handleAdd() {
    onAdd({ ...newGame, id: Date.now().toString() });
    resetNewGame();
    showAddForm = false;
  }

  function resetNewGame() {
    newGame = {
      id: "",
      title: "",
      developer: "",
      genres: [],
      tags: [],
      rating: 0,
      status: "",
      description: "",
      myThoughts: "",
      links: [],
      coverImage: "",
      explicit: false,
      percent: 0,
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
      Games ({games.length})
    </h3>
    <Button
      onclick={() => {
        showAddForm = !showAddForm;
      }}
    >
      {showAddForm ? "Cancel" : "Add Game"}
    </Button>
  </div>

  {#if showAddForm}
    <div
      class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
    >
      <h4 class="font-medium text-rose-pine-text mb-3">Add New Game</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          bind:value={newGame.title}
          placeholder="Title"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newGame.developer}
          placeholder="Developer"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          value={newGame.genres.join(", ")}
          oninput={(e) =>
            (newGame.genres = updateArrayField(e.currentTarget.value))}
          placeholder="Genres (comma-separated)"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          value={newGame.tags.join(", ")}
          oninput={(e) =>
            (newGame.tags = updateArrayField(e.currentTarget.value))}
          placeholder="Tags (comma-separated)"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newGame.rating}
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Rating"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newGame.status}
          placeholder="Status"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newGame.coverImage}
          placeholder="Cover Image URL"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newGame.percent}
          type="number"
          min="0"
          max="100"
          placeholder="Completion %"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <label class="flex items-center gap-2 text-rose-pine-text">
          <input
            bind:checked={newGame.explicit}
            type="checkbox"
            class="w-4 h-4 text-rose-pine-iris bg-rose-pine-base border-rose-pine-overlay rounded focus:ring-rose-pine-iris focus:ring-2"
          />
          Explicit Content
        </label>
      </div>
      <div class="mt-4 space-y-3">
        <textarea
          bind:value={newGame.description}
          placeholder="Description"
          rows="3"
          class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris resize-none"
        ></textarea>
        <textarea
          bind:value={newGame.myThoughts}
          placeholder="My Thoughts"
          rows="3"
          class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris resize-none"
        ></textarea>
      </div>
      <div class="mt-4 flex gap-2">
        <Button
          onclick={handleAdd}
          disabled={!newGame.title.trim() || !newGame.developer.trim()}
        >
          Add Game
        </Button>
        <Button
          variant="secondary"
          onclick={() => {
            showAddForm = false;
            resetNewGame();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  {/if}

  <div class="space-y-3 max-h-96 overflow-y-auto rose-pine-scrollbar">
    {#each games as game, index}
      <div
        class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              {#if game.coverImage}
                <img
                  src={game.coverImage}
                  alt={game.title}
                  class="w-16 h-12 object-cover rounded"
                />
              {/if}
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-rose-pine-text truncate">
                  {game.title}
                </h4>
                <p class="text-sm text-rose-pine-muted truncate">
                  by {game.developer}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    class="text-xs px-2 py-1 bg-rose-pine-iris/20 text-rose-pine-iris rounded"
                  >
                    ⭐ {game.rating}
                  </span>
                  <span
                    class="text-xs px-2 py-1 bg-rose-pine-foam/20 text-rose-pine-foam rounded"
                  >
                    {game.status}
                  </span>
                  <span
                    class="text-xs px-2 py-1 bg-rose-pine-gold/20 text-rose-pine-gold rounded"
                  >
                    {game.percent}%
                  </span>
                  {#if game.explicit}
                    <span
                      class="text-xs px-2 py-1 bg-rose-pine-love/20 text-rose-pine-love rounded"
                    >
                      Explicit
                    </span>
                  {/if}
                </div>
              </div>
            </div>
            {#if game.genres.length > 0}
              <div class="flex flex-wrap gap-1 mb-2">
                {#each game.genres as genre}
                  <span
                    class="text-xs px-2 py-1 bg-rose-pine-pine/20 text-rose-pine-pine rounded"
                  >
                    {genre}
                  </span>
                {/each}
              </div>
            {/if}
            {#if game.description}
              <p class="text-sm text-rose-pine-subtle line-clamp-2">
                {game.description}
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
