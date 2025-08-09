<script lang="ts">
  interface Props {
    title: string;
  }

  let { title }: Props = $props();
</script>

<header class="bg-rose-pine-surface border-b border-rose-pine-overlay p-4">
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold text-rose-pine-text flex items-center gap-2">
      <div
        class="w-8 h-8 bg-gradient-to-br from-rose-pine-love to-rose-pine-pine rounded-lg flex items-center justify-center"
      >
        <span class="text-white font-bold text-sm">A</span>
      </div>
      {title}
    </h1>
  </div>
</header>
