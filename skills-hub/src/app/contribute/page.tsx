"use client";

import { FileUploader } from "@/components/FileUploader";
import { BackLink } from "@/components/BackLink";
import { useTranslation } from "@/i18n/context";

export default function ContributePage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="px-6 pt-16 pb-24 max-w-3xl mx-auto">
        <div className="mb-10">
          <BackLink />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          {t("contribute.title")}
        </h1>
        <p className="text-zinc-400 mb-10">
          {t("contribute.description")}
        </p>

        {/* Format guide */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-zinc-300 mb-3">
            {t("contribute.formatTitle")}
          </h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-400 overflow-auto">
            <pre className="whitespace-pre-wrap">{`---
name: your-skill-name
description: >
  One or two sentences describing what the skill
  does and when to use it.
---

# Skill Title

Your skill instructions go here. This is the
content Claude will follow when the skill is
activated.

## Section

Add as many sections as needed to structure
your instructions.`}</pre>
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            {t("contribute.formatNote", {
              nameField: "name",
              descField: "description",
            })}
          </p>
        </div>

        {/* Uploader */}
        <FileUploader />
      </section>
    </main>
  );
}
