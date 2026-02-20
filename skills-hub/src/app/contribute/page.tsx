import Link from "next/link";
import { parseMarkdown } from "@/lib/skills";
import { ArrowLeft } from "lucide-react";

const requirements = `
Your skill needs three files in a single folder:

\`\`\`
your-skill-name/
├── SKILL.md      ← the actual skill instructions for Claude
├── README.md     ← what it does, how to use it (shown on the site)
└── meta.json     ← metadata for filtering and display
\`\`\`

## meta.json format

\`\`\`json
{
  "name": "Your Skill Name",
  "description": "One sentence. What it does and when to use it.",
  "author": "your-github-handle",
  "category": "design | engineering | writing | data | productivity | finance",
  "tags": ["tag1", "tag2"],
  "platform": ["claude-code"],
  "requires": [],
  "version": "1.0.0",
  "createdAt": "YYYY-MM-DD"
}
\`\`\`
`;

export default async function ContributePage() {
  const html = await parseMarkdown(requirements.trim());

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="px-6 pt-16 pb-24 max-w-3xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Add a skill</h1>
        <p className="text-zinc-400 mb-8">
          Prepare your files, then message me to get them added.
        </p>
        <div
          className="prose prose-invert prose-zinc max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <a
          href="https://meli.enterprise.slack.com/messages/U01M372LMRA"
          target="_blank"
          className="mt-10 inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Message me on Slack
        </a>
      </section>
    </main>
  );
}
