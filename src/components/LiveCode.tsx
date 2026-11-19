import { useId } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

interface Props {
  /** JSX source shown in the editor and rendered live. */
  code: string;
  /** Values available to the snippet (components, hooks, helpers). */
  scope?: Record<string, unknown>;
  /** Set true when the snippet calls render(<App />) itself. */
  noInline?: boolean;
  title?: string;
}

export default function LiveCode({ code, scope = {}, noInline = false, title = "Live example" }: Props) {
  const id = useId();
  return (
    <LiveProvider code={code.trim()} scope={scope} noInline={noInline}>
      <figure className="live-code my-8 border border-border-strong rounded-md bg-surface overflow-hidden" aria-labelledby={id}>
        <figcaption id={id} className="py-2 px-4 text-sm text-muted border-b border-border">
          {title}
        </figcaption>
        <div className="preview py-6 px-4">
          <LivePreview />
        </div>
        <div className="border-t border-border font-mono text-sm">
          <LiveEditor aria-label={`${title}: editable code`} className="[&_pre]:m-0 [&_pre]:rounded-none" />
        </div>
        <LiveError className="m-0 py-3 px-4 rounded-none text-sm text-on-danger bg-danger-surface whitespace-pre-wrap" />
      </figure>
    </LiveProvider>
  );
}

