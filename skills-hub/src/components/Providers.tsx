"use client";

import { I18nProvider } from "@/i18n/context";
import { AdminProvider } from "@/components/AdminProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AdminProvider>{children}</AdminProvider>
    </I18nProvider>
  );
}
