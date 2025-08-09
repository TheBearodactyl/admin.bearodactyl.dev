<script lang="ts">
  interface Props {
    content: string;
    onUpdate: (content: string) => void;
    onSave: () => void;
    onCancel: () => void;
  }

  let { content, onUpdate, onSave, onCancel }: Props = $props();
</script>
