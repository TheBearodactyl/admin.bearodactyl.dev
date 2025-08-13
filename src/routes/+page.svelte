<script lang="ts">
  import { appState } from "$lib/stores/app-state.svelte.js";
  import GitHubConfig from "$lib/components/GitHubConfig.svelte";
  import DataTypeSelector from "$lib/components/DataTypeSelector.svelte";
  import RawEditor from "$lib/components/RawEditor.svelte";
  import BookEditor from "$lib/components/BookEditor.svelte";
  import GameEditor from "$lib/components/GameEditor.svelte";
  import ReviewEditor from "$lib/components/ReviewEditor.svelte";
  import ProjectEditor from "$lib/components/ProjectEditor.svelte";
  import Button from "$lib/components/Button.svelte";
  import type { Book, DataType, WplaceScreenshot, Game, Project, Review } from "$lib/types.js";
  import WplaceEditor from "$lib/components/WplaceEditor.svelte";

  const state = appState.state;

  const dataCounts = $derived({
    books: state.books.length,
    games: state.games.length,
    reviews: state.reviews.length,
    projects: state.projects.length,
    wplace: state.wplace.length, 
  });

  async function handleDownload(dataType: DataType) {
    await appState.downloadData(dataType);
  }

  async function handleUpload(dataType: DataType) {
    await appState.uploadData(dataType);
  }

  function handleDataTypeSelect(dataType: DataType) {
    appState.setActiveDataType(dataType);
  }

  function handleToggleRawEdit() {
    appState.toggleRawEditMode();
  }

  function handleRawContentUpdate(content: string) {
    appState.updateRawContent(content);
  }

  function handleRawSave() {
    appState.toggleRawEditMode();
  }

  function handleRawCancel() {
    if (state.activeDataType) {
      appState.updateRawContent(
        JSON.stringify(state[state.activeDataType], null, 2)
      );
      state.rawEditMode = false;
    }
  }
</script>

<div class="space-y-6">
  {#if !state.githubConfig}
    <GitHubConfig onSave={appState.initGitHub} />
  {:else}
    <div
      class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
    >
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-rose-pine-text">
            Connected to GitHub
          </h2>
          <p class="text-sm text-rose-pine-muted">
            {state.githubConfig.owner}/{state.githubConfig.repo}
          </p>
        </div>
        <Button
          variant="secondary"
          onclick={() => appState.initGitHub(null)}
        >
          Disconnect
        </Button>
      </div>
    </div>

    <DataTypeSelector
      activeType={state.activeDataType}
      onSelect={handleDataTypeSelect}
      onDownload={handleDownload}
      onUpload={handleUpload}
      loading={state.loading === state.activeDataType}
      {dataCounts}
    />

    {#if state.activeDataType}
      <div
        class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-rose-pine-text capitalize">
            {state.activeDataType === "wplace" ?
              "Wplace Findings"
            : state.activeDataType} Editor
          </h2>
          <div class="flex gap-2">
            <Button
              size="sm"
              variant={state.rawEditMode ? "primary" : "secondary"}
              onclick={handleToggleRawEdit}
            >
              {state.rawEditMode ? "Visual Editor" : "Raw JSON"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onclick={() => appState.setActiveDataType(null)}
            >
              Close
            </Button>
          </div>
        </div>

        {#if state.rawEditMode}
          <RawEditor
            content={state.rawContent}
            onUpdate={handleRawContentUpdate}
            onSave={handleRawSave}
            onCancel={handleRawCancel}
          />
        {:else if state.activeDataType === "books"}
          <BookEditor
            books={state.books as Book[]}
            onUpdate={(index, book) =>
              appState.updateItem("books", index, book)}
            onAdd={(book) => appState.addItem("books", book)}
            onRemove={(index) => appState.removeItem("books", index)}
          />
        {:else if state.activeDataType === "games"}
          <GameEditor
            games={state.games as Game[]}
            onUpdate={(index, game) =>
              appState.updateItem("games", index, game)}
            onAdd={(game) => appState.addItem("games", game)}
            onRemove={(index) => appState.removeItem("games", index)}
          />
        {:else if state.activeDataType === "reviews"}
          <ReviewEditor
            reviews={state.reviews as Review[]}
            onUpdate={(index, review) =>
              appState.updateItem("reviews", index, review)}
            onAdd={(review) => appState.addItem("reviews", review)}
            onRemove={(index) => appState.removeItem("reviews", index)}
          />
        {:else if state.activeDataType === "projects"}
          <ProjectEditor
            projects={state.projects as Project[]}
            onUpdate={(index, project) =>
              appState.updateItem("projects", index, project)}
            onAdd={(project) => appState.addItem("projects", project)}
            onRemove={(index) => appState.removeItem("projects", index)}
          />
        {:else if state.activeDataType === "wplace"}
          <WplaceEditor
            screenshots={state.wplace as WplaceScreenshot[]}
            onUpdate={(index, screenshot) =>
              appState.updateItem("wplace", index, screenshot)}
            onAdd={(screenshot) => appState.addItem("wplace", screenshot)}
            onRemove={(index) => appState.removeItem("wplace", index)}
          />
        {/if}
      </div>
    {/if}
  {/if}
</div>
