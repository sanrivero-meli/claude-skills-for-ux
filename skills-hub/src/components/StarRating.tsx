"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
};

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 18,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const display = hovered || value;

  return (
    <div
      className="inline-flex gap-0.5"
      onMouseLeave={() => !readonly && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          className={`transition-colors ${
            readonly
              ? "cursor-default"
              : "cursor-pointer hover:scale-110 transition-transform"
          }`}
        >
          <Star
            size={size}
            className={
              star <= display
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-zinc-600"
            }
          />
        </button>
      ))}
    </div>
  );
}
