<script lang="ts">
  interface Props {
    size?: "sm" | "md" | "lg";
  }

  let { size = "md" }: Props = $props();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
</script>

<div
  class="animate-spin rounded-full border-2 border-rose-pine-muted border-t-rose-pine-iris {sizeClasses[
    size
  ]}"
></div>
