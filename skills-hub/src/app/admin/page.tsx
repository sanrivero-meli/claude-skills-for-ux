"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/components/AdminProvider";
import { AdminLoginButton } from "@/components/AdminLoginButton";
import { Button } from "@/components/ui/button";
import { BackLink } from "@/components/BackLink";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import type { Locale } from "@/i18n/types";

type Contribution = {
  key: string;
  name: string;
  description: string;
  body: string;
  raw: string;
  submittedAt: string;
  status: string;
};

const dateLocaleMap: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
};

export default function AdminPage() {
  const { isAdmin, token } = useAdmin();
  const { t, locale } = useTranslation();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchContributions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contribute", {
        headers: { "x-admin-secret": token },
      });
      if (!res.ok) throw new Error(t("admin.failedLoad"));
      const data = await res.json();
      setContributions(data.contributions);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.failedLoad"));
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    if (isAdmin) fetchContributions();
  }, [isAdmin, fetchContributions]);

  const handleDismiss = async (key: string) => {
    if (!token) return;

    try {
      const res = await fetch("/api/contribute", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": token,
        },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) throw new Error(t("admin.failedDelete"));
      setContributions((prev) => prev.filter((c) => c.key !== key));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.failedDelete"));
    }
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50">
        <section className="px-6 pt-16 pb-24 max-w-3xl mx-auto">
          <div className="mb-10">
            <BackLink />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">{t("admin.title")}</h1>
          <p className="text-zinc-400 mb-6">{t("admin.loginPrompt")}</p>
          <AdminLoginButton />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="px-6 pt-16 pb-24 max-w-3xl mx-auto">
        <div className="mb-10">
          <BackLink />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1">
              {t("admin.submissions")}
            </h1>
            <p className="text-zinc-500 text-sm">
              {t("admin.pending", {
                count: contributions.length,
                label:
                  contributions.length === 1
                    ? t("common.contribution")
                    : t("common.contributions"),
              })}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchContributions}>
            {t("admin.refresh")}
          </Button>
        </div>

        {loading && (
          <p className="text-zinc-500 text-sm">{t("common.loading")}</p>
        )}

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {!loading && contributions.length === 0 && (
          <div className="border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-zinc-500 text-sm">{t("admin.noSubmissions")}</p>
          </div>
        )}

        <div className="space-y-3">
          {contributions.map((c) => (
            <div
              key={c.key}
              className="border border-zinc-800 rounded-xl overflow-hidden"
            >
              <div className="flex items-start justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {c.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {c.description}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {new Date(c.submittedAt).toLocaleDateString(dateLocaleMap[locale], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-3 shrink-0">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => toggleExpand(c.key)}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    {expanded.has(c.key) ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDismiss(c.key)}
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              {expanded.has(c.key) && (
                <div className="px-4 pb-4">
                  <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-400 overflow-auto max-h-96 whitespace-pre-wrap">
                    {c.raw}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
