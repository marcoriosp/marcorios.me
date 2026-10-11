"use client";

import { useEffect, useState } from "react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      className="contact-btn is-secondary"
      onClick={() => {
        navigator.clipboard?.writeText(email).then(() => setCopied(true), () => {});
      }}
    >
      <i className={`fa ${copied ? "fa-check" : "fa-copy"}`} aria-hidden="true" />
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}
