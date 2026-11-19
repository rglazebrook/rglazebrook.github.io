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
      <figure className="live-code" aria-labelledby={id}>
        <figcaption id={id} className="live-code__title">{title}</figcaption>
        <div className="live-code__preview">
          <LivePreview />
        </div>
        <div className="live-code__editor">
          <LiveEditor aria-label={`${title}: editable code`} />
        </div>
        <LiveError className="live-code__error" />
      </figure>
    </LiveProvider>
  );
}
