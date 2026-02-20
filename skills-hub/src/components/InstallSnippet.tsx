"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function InstallSnippet({
  slug,
  orgRepo,
}: {
  slug: string;
  orgRepo: string;
}) {
  const [copied, setCopied] = useState(false);
  const cmd = `git clone https://github.com/${orgRepo} /tmp/skills-hub && cp -r /tmp/skills-hub/skills/${slug} .claude/skills/${slug}`;

  const copy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
        Install
      </p>
      <div className="flex items-start gap-3">
        <code className="text-xs text-zinc-300 font-mono leading-relaxed flex-1 break-all">
          {cmd}
        </code>
        <button
          onClick={copy}
          className="shrink-0 text-zinc-500 hover:text-zinc-200 transition-colors mt-0.5"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
