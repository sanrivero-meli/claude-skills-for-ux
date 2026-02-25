"use client";

import { useState } from "react";
import { useAdmin } from "@/components/AdminProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, LogOut } from "lucide-react";
import { useTranslation } from "@/i18n/context";

export function AdminLoginButton() {
  const { isAdmin, login, logout } = useAdmin();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(password);
    if (success) {
      setShowPrompt(false);
      setPassword("");
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isAdmin) {
    return (
      <Button
        variant="ghost"
        size="xs"
        onClick={logout}
        className="text-zinc-600 hover:text-zinc-400"
      >
        <LogOut size={12} />
        {t("auth.admin")}
      </Button>
    );
  }

  if (showPrompt) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="password"
          placeholder={t("auth.passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-7 w-40 text-xs"
          autoFocus
        />
        <Button type="submit" size="xs" variant="secondary">
          {t("auth.enter")}
        </Button>
        <Button
          type="button"
          size="xs"
          variant="ghost"
          onClick={() => {
            setShowPrompt(false);
            setError(false);
          }}
        >
          {t("auth.cancel")}
        </Button>
        {error && (
          <span className="text-red-400 text-xs">{t("auth.wrongPassword")}</span>
        )}
      </form>
    );
  }

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={() => setShowPrompt(true)}
      className="text-zinc-600 hover:text-zinc-400"
    >
      <Lock size={12} />
    </Button>
  );
}
