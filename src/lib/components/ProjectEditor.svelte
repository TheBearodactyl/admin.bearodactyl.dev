<script lang="ts">
  import Button from "./Button.svelte";
  import type { Project } from "../types.js";

  interface Props {
    projects: Project[];
    onUpdate: (index: number, project: Project) => void;
    onAdd: (project: Project) => void;
    onRemove: (index: number) => void;
  }

  let { projects, onUpdate, onAdd, onRemove }: Props = $props();

  let showAddForm = $state(false);
  let newProject = $state<Project>({
    name: "",
    description: "",
    tags: [],
    source: "",
    coverImage: "",
    installCommand: "",
  });

  function handleAdd() {
    onAdd({ ...newProject });
    resetNewProject();
    showAddForm = false;
  }

  function resetNewProject() {
    newProject = {
      name: "",
      description: "",
      tags: [],
      source: "",
      coverImage: "",
      installCommand: "",
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
      Projects ({projects.length})
    </h3>
    <Button
      onclick={() => {
        showAddForm = !showAddForm;
      }}
    >
      {showAddForm ? "Cancel" : "Add Project"}
    </Button>
  </div>

  {#if showAddForm}
    <div
      class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
    >
      <h4 class="font-medium text-rose-pine-text mb-3">Add New Project</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          bind:value={newProject.name}
          placeholder="Project Name"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newProject.source}
          placeholder="Source URL"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          value={newProject.tags?.join(", ") || ""}
          oninput={(e) =>
            (newProject.tags = updateArrayField(e.currentTarget.value))}
          placeholder="Tags (comma-separated)"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newProject.coverImage}
          placeholder="Cover Image URL (optional)"
          class="px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
        <input
          bind:value={newProject.installCommand}
          placeholder="Install Command (optional)"
          class="md:col-span-2 px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris"
        />
      </div>
      <div class="mt-4">
        <textarea
          bind:value={newProject.description}
          placeholder="Description"
          rows="3"
          class="w-full px-3 py-2 bg-rose-pine-base border border-rose-pine-overlay rounded-lg text-rose-pine-text placeholder-rose-pine-muted focus:outline-none focus:ring-2 focus:ring-rose-pine-iris resize-none"
        ></textarea>
      </div>
      <div class="mt-4 flex gap-2">
        <Button
          onclick={handleAdd}
          disabled={!newProject.name.trim() ||
            !newProject.description.trim() ||
            !newProject.source.trim()}
        >
          Add Project
        </Button>
        <Button
          variant="secondary"
          onclick={() => {
            showAddForm = false;
            resetNewProject();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  {/if}

  <div class="space-y-3 max-h-96 overflow-y-auto rose-pine-scrollbar">
    {#each projects as project, index}
      <div
        class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              {#if project.coverImage}
                <img
                  src={project.coverImage}
                  alt={project.name}
                  class="w-12 h-12 object-cover rounded"
                />
              {/if}
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-rose-pine-text truncate">
                  {project.name}
                </h4>
                <a
                  href={project.source}
                  target="_blank"
                  rel="noopener"
                  class="text-sm text-rose-pine-foam hover:underline truncate block"
                >
                  {project.source}
                </a>
              </div>
            </div>
            {#if project.tags && project.tags.length > 0}
              <div class="flex flex-wrap gap-1 mb-2">
                {#each project.tags as tag}
                  <span
                    class="text-xs px-2 py-1 bg-rose-pine-gold/20 text-rose-pine-gold rounded"
                  >
                    {tag}
                  </span>
                {/each}
              </div>
            {/if}
            <p class="text-sm text-rose-pine-subtle line-clamp-2">
              {project.description}
            </p>
            {#if project.installCommand}
              <code
                class="text-xs bg-rose-pine-base px-2 py-1 rounded mt-2 block text-rose-pine-text"
              >
                {project.installCommand}
              </code>
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
