<script lang="ts">
  import Button from "./Button.svelte";
  import type { DataType } from "../types.js";

  interface Props {
    activeType: DataType | null;
    onSelect: (type: DataType) => void;
    onDownload: (type: DataType) => Promise<void>;
    onUpload: (type: DataType) => Promise<void>;
    loading: DataType | null;
    dataCounts: Record<DataType, number>;
  }

  let {
    activeType,
    onSelect,
    onDownload,
    onUpload,
    loading,
    dataCounts,
  }: Props = $props();

  const dataTypes: Array<{
    key: DataType;
    label: string;
    icon: string;
    color: string;
  }> = [
    { key: "books", label: "Books", icon: "📚", color: "rose-pine-love" },
    { key: "games", label: "Games", icon: "🎮", color: "rose-pine-pine" },
    { key: "reviews", label: "Reviews", icon: "📝", color: "rose-pine-foam" },
    { key: "projects", label: "Projects", icon: "🛠️", color: "rose-pine-gold" },
  ];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {#each dataTypes as dataType}
    <div
      class="bg-rose-pine-surface rounded-lg p-4 border border-rose-pine-overlay"
    >
      <div class="flex items-center gap-2 mb-3">
        <span class="text-2xl">{dataType.icon}</span>
        <div>
          <h3 class="font-semibold text-rose-pine-text">{dataType.label}</h3>
          <p class="text-sm text-rose-pine-muted">
            {dataCounts[dataType.key]} items
          </p>
        </div>
      </div>

      <div class="space-y-2">
        <Button
          size="sm"
          variant={activeType === dataType.key ? "primary" : "secondary"}
          onclick={() => onSelect(dataType.key)}
        >
          {activeType === dataType.key ? "Selected" : "Edit"}
        </Button>

        <div class="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onclick={() => onDownload(dataType.key)}
            loading={loading === dataType.key}
          >
            ⬇️ Pull
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onclick={() => onUpload(dataType.key)}
            loading={loading === dataType.key}
          >
            ⬆️ Push
          </Button>
        </div>
      </div>
    </div>
  {/each}
</div>
