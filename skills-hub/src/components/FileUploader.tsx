"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Check } from "lucide-react";
import matter from "gray-matter";
import { useTranslation } from "@/i18n/context";

type ParsedSkill = {
  name: string;
  description: string;
  body: string;
  raw: string;
};

type UploadState = "idle" | "preview" | "submitting" | "success" | "error";

export function FileUploader() {
  const { t } = useTranslation();
  const [state, setState] = useState<UploadState>("idle");
  const [parsed, setParsed] = useState<ParsedSkill | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    if (!file.name.endsWith(".md")) {
      setError(t("uploader.errorMdOnly"));
      return;
    }

    if (file.size > 50 * 1024) {
      setError(t("uploader.errorSize"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target?.result as string;
      try {
        const { data, content } = matter(raw);
        if (!data.name || !data.description) {
          setError(t("uploader.errorFrontmatter"));
          return;
        }
        setParsed({
          name: data.name,
          description: data.description,
          body: content.trim(),
          raw,
        });
        setState("preview");
      } catch {
        setError(t("uploader.errorYaml"));
      }
    };
    reader.readAsText(file);
  }, [t]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSubmit = async () => {
    if (!parsed) return;
    setState("submitting");

    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("uploader.errorSubmission"));
      }

      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("uploader.errorSubmission"));
      setState("error");
    }
  };

  const handleReset = () => {
    setParsed(null);
    setError(null);
    setState("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  if (state === "success") {
    return (
      <div className="border border-zinc-800 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 mb-4">
          <Check size={20} className="text-emerald-400" />
        </div>
        <p className="text-zinc-200 font-medium mb-1">{t("uploader.successTitle")}</p>
        <p className="text-zinc-500 text-sm mb-6">
          {t("uploader.successDescription")}
        </p>
        <Button variant="secondary" size="sm" onClick={handleReset}>
          {t("uploader.submitAnother")}
        </Button>
      </div>
    );
  }

  if ((state === "preview" || state === "submitting") && parsed) {
    return (
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <FileText size={14} className="text-zinc-500" />
            {parsed.name}
          </div>
          <button
            onClick={handleReset}
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <span className="text-xs text-zinc-500">{t("uploader.fieldName")}</span>
            <p className="text-sm text-zinc-200">{parsed.name}</p>
          </div>
          <div>
            <span className="text-xs text-zinc-500">{t("uploader.fieldDescription")}</span>
            <p className="text-sm text-zinc-200">{parsed.description}</p>
          </div>
          <div>
            <span className="text-xs text-zinc-500">{t("uploader.fieldBody")}</span>
            <pre className="mt-1 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-400 overflow-auto max-h-64 whitespace-pre-wrap">
              {parsed.body}
            </pre>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800">
          <Button
            onClick={handleSubmit}
            disabled={state === "submitting"}
            size="sm"
          >
            {state === "submitting" ? t("uploader.submitting") : t("uploader.submit")}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            {t("uploader.replaceFile")}
          </Button>
        </div>

        {error && (
          <p className="px-4 pb-3 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
          dragOver
            ? "border-zinc-500 bg-zinc-900/50"
            : "border-zinc-800 hover:border-zinc-700"
        }`}
      >
        <Upload size={24} className="mx-auto text-zinc-600 mb-3" />
        <p className="text-sm text-zinc-400 mb-1">
          {t("uploader.dropText")}
        </p>
        <p className="text-xs text-zinc-600">{t("uploader.sizeLimit")}</p>
        <input
          ref={inputRef}
          type="file"
          accept=".md"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
