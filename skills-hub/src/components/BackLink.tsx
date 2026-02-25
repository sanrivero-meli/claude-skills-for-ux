"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/i18n/context";

export function BackLink({ href = "/" }: { href?: string }) {
  const { t } = useTranslation();

  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
    >
      <ArrowLeft size={14} />
      {t("common.back")}
    </Link>
  );
}
