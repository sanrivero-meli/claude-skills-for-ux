"use client";

import { useState } from "react";
import { useAdmin } from "@/components/AdminProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import type { Skill } from "@/lib/skills";

type EditableFields = Pick<
  Skill,
  | "name"
  | "description"
  | "author"
  | "category"
  | "tags"
  | "platform"
  | "requires"
  | "version"
>;

function cloneFields(source: EditableFields): EditableFields {
  return {
    name: source.name,
    description: source.description,
    author: source.author,
    category: source.category,
    tags: [...source.tags],
    platform: [...source.platform],
    requires: [...source.requires],
    version: source.version,
  };
}

export function EditableSkillMeta({ skill }: { skill: Skill }) {
  const { isAdmin, token } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<EditableFields>(() =>
    cloneFields(skill)
  );
  const [draft, setDraft] = useState<EditableFields>(() =>
    cloneFields(skill)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setDraft(cloneFields(current));
    setIsEditing(true);
    setError(null);
  };

  const cancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/skills/${skill.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": token!,
        },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const text = await res.text();
        let message = "Save failed";
        try { message = JSON.parse(text).error || message; } catch {}
        throw new Error(message);
      }
      const data = await res.json();
      setCurrent(cloneFields(data.meta));
      setIsEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof EditableFields, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const addToArray = (
    field: "tags" | "platform" | "requires",
    value: string
  ) => {
    if (!value.trim()) return;
    setDraft((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
  };

  const removeFromArray = (
    field: "tags" | "platform" | "requires",
    index: number
  ) => {
    setDraft((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // --- EDIT MODE ---
  if (isEditing) {
    return (
      <div className="mb-8 space-y-4">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Name</label>
          <Input
            value={draft.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="text-lg font-semibold"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-zinc-500">Description</label>
            <span
              className={`text-xs ${draft.description.length > 100 ? "text-red-400" : "text-zinc-600"}`}
            >
              {draft.description.length}/100
            </span>
          </div>
          <textarea
            value={draft.description}
            onChange={(e) => updateField("description", e.target.value)}
            maxLength={100}
            rows={2}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-zinc-300 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Author</label>
            <Input
              value={draft.author}
              onChange={(e) => updateField("author", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              Category
            </label>
            <Input
              value={draft.category}
              onChange={(e) => updateField("category", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-500 block mb-1">Version</label>
          <Input
            value={draft.version}
            onChange={(e) => updateField("version", e.target.value)}
            className="max-w-32"
          />
        </div>

        <ArrayEditor
          label="Platform"
          items={draft.platform}
          onAdd={(v) => addToArray("platform", v)}
          onRemove={(i) => removeFromArray("platform", i)}
        />

        <ArrayEditor
          label="Requires"
          items={draft.requires}
          onAdd={(v) => addToArray("requires", v)}
          onRemove={(i) => removeFromArray("requires", i)}
        />

        <div className="flex items-center gap-2 pt-2">
          <Button onClick={save} disabled={saving} size="sm">
            <Save size={14} />
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button onClick={cancel} variant="ghost" size="sm" disabled={saving}>
            <X size={14} />
            Cancel
          </Button>
          {error && <span className="text-red-400 text-xs">{error}</span>}
        </div>
      </div>
    );
  }

  // --- READ MODE ---
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary">{current.category}</Badge>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">{current.name}</h1>
          <p className="text-zinc-400">{current.description}</p>
          <p className="text-zinc-600 text-sm mt-2">by {current.author}</p>
        </div>
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={startEditing}
            className="text-zinc-600 hover:text-zinc-300 shrink-0 mt-1"
          >
            <Pencil size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}

function ArrayEditor({
  label,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    onAdd(newItem);
    setNewItem("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <label className="text-xs text-zinc-500 block mb-1">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1 text-xs border border-zinc-700 rounded-full px-2 py-0.5 text-zinc-300"
          >
            {item}
            <button
              onClick={() => onRemove(i)}
              className="text-zinc-500 hover:text-red-400"
            >
              <Trash2 size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="h-7 text-xs max-w-48"
        />
        <Button type="button" variant="ghost" size="xs" onClick={handleAdd}>
          <Plus size={12} />
        </Button>
      </div>
    </div>
  );
}
