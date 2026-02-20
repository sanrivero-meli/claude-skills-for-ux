"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function InstallSnippet({
  installPrompt,
}: {
  installPrompt: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!installPrompt.trim()) return null;

  const copy = () => {
    navigator.clipboard.writeText(installPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
        Install
      </p>

      <p className="text-xs text-zinc-400 mb-2">
        Copy and paste into Claude to install
      </p>

      <div className="relative rounded-lg bg-zinc-950 border border-zinc-800 p-3">
        <button
          onClick={copy}
          className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-200 transition-colors"
          aria-label="Copy install prompt"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        <pre className="text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto pr-6">
          {installPrompt}
        </pre>
      </div>
    </div>
  );
}
