"use client";
import React from "react";

/**
 * ShareLink
 * Renders a small copy-to-clipboard button for a given relative URL.
 * Expands to absolute using window.location.origin at runtime.
 */
export function ShareLink({ relativeHref }: { relativeHref: string }) {
  const [copied, setCopied] = React.useState<null | "ok" | "err">(null);
  const absolute = typeof window !== "undefined"
    ? new URL(relativeHref, window.location.origin).toString()
    : relativeHref;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied("ok");
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied("err");
      setTimeout(() => setCopied(null), 1500);
    }
  }

  return (
    <div className="mt-2 flex items-center gap-2 text-xs">
      <code className="px-1 py-0.5 rounded border truncate">{relativeHref}</code>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center rounded-md border px-2 py-1 hover:shadow"
        aria-label="Copy share link"
      >
        Copy
      </button>
      {copied === "ok" && <span className="text-green-600">Copied</span>}
      {copied === "err" && <span className="text-red-600">Copy failed</span>}
    </div>
  );
}

export default ShareLink;
