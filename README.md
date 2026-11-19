# Rob Glazebrook — portfolio

Astro + MDX + React. Static output, intended for GitHub Pages at https://rglazebrook.github.io.

## Commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Dev server at http://localhost:4321           |
| `npm run build`   | Production build to `dist/`                   |
| `npm run preview` | Serve the production build locally            |
| `npx astro check` | Type-check `.astro`, `.ts`, `.tsx`            |

## Layout

- `src/styles/tokens.css`: design tokens (primitives → semantic aliases; light/dark themes)
- `src/content/writing/`: posts as `.md` / `.mdx`. `draft: true` shows in dev only.
- `src/components/LiveCode.tsx`: editable live React examples (react-live). Use in MDX:

  ```mdx
  import LiveCode from "../../components/LiveCode.tsx";

  <LiveCode client:visible title="Example" code={`() => <button>Hi</button>`} />
  ```

  Inline mode renders the snippet's final *expression*: write `() => …` or plain JSX,
  not a `function` declaration. For multi-component snippets pass `noInline` and call
  `render(<App />)`. Pass components to snippets through `scope`.
- `src/data/work.ts`: project and earlier-work cards.
