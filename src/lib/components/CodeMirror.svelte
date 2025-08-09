<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { EditorState, type Extension } from "@codemirror/state";
  import { json } from "@codemirror/lang-json";
  import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { tags as t } from "@lezer/highlight";

  interface Props {
    value: string;
    onchange?: (value: string) => void;
    readonly?: boolean;
    placeholder?: string;
  }

  const colors = {
    base: "#191724",
    surface: "#1f1d2e",
    overlay: "#26233a",
    muted: "#6e6a86",
    subtle: "#908caa",
    text: "#e0def4",
    love: "#eb6f92",
    gold: "#f6c177",
    rose: "#ebbcba",
    pine: "#31748f",
    foam: "#9ccfd8",
    iris: "#c4a7e7",
    highlightLow: "#21202e",
    highlightMed: "#403d52",
    highlightHigh: "#524f67",
  };

  const rosePineHighlightStyle = HighlightStyle.define([
    { tag: t.keyword, color: colors.pine },
    {
      tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
      color: colors.text,
    },
    { tag: [t.function(t.variableName), t.labelName], color: colors.foam },
    {
      tag: [t.color, t.constant(t.name), t.standard(t.name)],
      color: colors.rose,
    },
    { tag: [t.definition(t.name), t.separator], color: colors.iris },
    {
      tag: [
        t.typeName,
        t.className,
        t.number,
        t.changed,
        t.annotation,
        t.modifier,
        t.self,
        t.namespace,
      ],
      color: colors.gold,
    },
    {
      tag: [
        t.operator,
        t.operatorKeyword,
        t.url,
        t.escape,
        t.regexp,
        t.link,
        t.special(t.string),
      ],
      color: colors.pine,
    },
    { tag: [t.meta, t.comment], color: colors.muted, fontStyle: "italic" },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.link, color: colors.foam, textDecoration: "underline" },
    { tag: t.heading, fontWeight: "bold", color: colors.love },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: colors.rose },
    {
      tag: [t.processingInstruction, t.string, t.inserted],
      color: colors.gold,
    },
    {
      tag: t.invalid,
      color: colors.love,
      backgroundColor: colors.highlightMed,
    },
  ]);

  const rosePineTheme = [
    EditorView.theme(
      {
        "&": {
          color: colors.text,
          backgroundColor: colors.base,
        },
        ".cm-content": {
          caretColor: colors.text,
          backgroundColor: colors.base,
        },
        ".cm-cursor, .cm-dropCursor": {
          borderLeft: `2px solid ${colors.text}`,
        },
        "&.cm-focused .cm-cursor": {
          borderLeftColor: colors.iris,
        },
        "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
          {
            backgroundColor: colors.highlightMed,
          },
        ".cm-panels": {
          backgroundColor: colors.surface,
          color: colors.text,
        },
        ".cm-panels.cm-panels-top": {
          borderBottom: `1px solid ${colors.overlay}`,
        },
        ".cm-panels.cm-panels-bottom": {
          borderTop: `1px solid ${colors.overlay}`,
        },
        ".cm-searchMatch": {
          backgroundColor: colors.highlightMed,
          outline: `1px solid ${colors.gold}`,
        },
        ".cm-searchMatch.cm-searchMatch-selected": {
          backgroundColor: colors.highlightHigh,
          outline: `1px solid ${colors.iris}`,
        },
        ".cm-activeLine": {
          backgroundColor: colors.highlightLow,
        },
        ".cm-selectionMatch": {
          backgroundColor: colors.highlightLow,
        },
        "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":
          {
            backgroundColor: colors.highlightMed,
            outline: `1px solid ${colors.foam}`,
          },
        ".cm-gutters": {
          backgroundColor: colors.surface,
          color: colors.muted,
          border: "none",
        },
        ".cm-activeLineGutter": {
          backgroundColor: colors.highlightLow,
          color: colors.text,
        },
        ".cm-foldPlaceholder": {
          backgroundColor: colors.overlay,
          border: `1px solid ${colors.muted}`,
          color: colors.text,
        },
        ".cm-tooltip": {
          border: `1px solid ${colors.overlay}`,
          backgroundColor: colors.surface,
          color: colors.text,
        },
        ".cm-tooltip .cm-tooltip-arrow:before": {
          borderTopColor: colors.overlay,
          borderBottomColor: colors.overlay,
        },
        ".cm-tooltip .cm-tooltip-arrow:after": {
          borderTopColor: colors.surface,
          borderBottomColor: colors.surface,
        },
      },
      { dark: true }
    ),
    syntaxHighlighting(rosePineHighlightStyle),
  ];

  let {
    value = "",
    onchange,
    readonly = false,
    placeholder = "",
  }: Props = $props();

  let element: HTMLDivElement;
  let view: EditorView;

  onMount(() => {
    const startState = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        json(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onchange && !readonly) {
            onchange(update.state.doc.toString());
          }
        }),
        EditorState.readOnly.of(readonly),
        // ...rosePineTheme,
        // syntaxHighlighting(rosePineHighlightStyle),
        // ...(placeholder ?
        //   [
        //     EditorView.theme({
        //       ".cm-placeholder": {
        //         color: colors.muted,
        //         fontStyle: "italic",
        //       },
        //     }),
        //   ]
        // : []),
      ],
    });

    view = new EditorView({
      state: startState,
      parent: element,
    });

    return () => {
      view?.destroy();
    };
  });

  onDestroy(() => {
    view?.destroy();
  });

  $effect(() => {
    if (view && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value,
        },
      });
    }
  });

  function highlightSelectionMatches(): Extension {
    throw new Error("Function not implemented.");
  }
</script>

<div
  bind:this={element}
  class="codemirror-wrapper"
></div>

<style>
  .codemirror-wrapper {
    background: var(--rose-pine-base);
    border-radius: 0.5rem;
    height: 400px;
    overflow: auto;
  }
</style>
