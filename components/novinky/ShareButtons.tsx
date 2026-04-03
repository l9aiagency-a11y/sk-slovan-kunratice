"use client";

import { useState } from "react";

interface ShareButtonsProps {
  slug: string;
  title: string;
}

export default function ShareButtons({ slug, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/novinky/${slug}`
      : `/novinky/${slug}`;

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={copyLink}
        className="text-sm px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
      >
        {copied ? "Zkopírováno!" : "Kopírovat odkaz"}
      </button>
      <a
        href={fbShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
      >
        Facebook
      </a>
    </div>
  );
}
