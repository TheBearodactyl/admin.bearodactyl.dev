<script lang="ts">
  import LoadingSpinner from "./LoadingSpinner.svelte";
  interface Props {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    onclick?: () => void | Promise<void>;
    children: any;
  }

  let {
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    onclick,
    children,
  }: Props = $props();

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-rose-pine-iris focus:ring-offset-2 focus:ring-offset-rose-pine-base disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-rose-pine-iris text-rose-pine-base hover:bg-rose-pine-iris/90",
    secondary:
      "bg-rose-pine-surface text-rose-pine-text border border-rose-pine-overlay hover:bg-rose-pine-overlay",
    danger: "bg-rose-pine-love text-rose-pine-base hover:bg-rose-pine-love/90",
    ghost: "text-rose-pine-text hover:bg-rose-pine-overlay",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  async function handleClick() {
    if (disabled || loading || !onclick) return;
    await onclick();
  }
</script>

<button
  class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]}"
  {disabled}
  onclick={handleClick}
  type="button"
>
  {#if loading}
    <LoadingSpinner size="sm" />
  {/if}
  {@render children()}
</button>
