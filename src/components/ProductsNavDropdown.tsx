"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { productCategories } from "@/data/content";

export default function ProductsNavDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const categories = productCategories.filter((c) => c !== "Tất cả");

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        Sản phẩm
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-2">
          <div className="w-56 rounded-2xl border border-border bg-surface p-2 shadow-xl">
            <Link
              href="/san-pham"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              Tất cả sản phẩm
            </Link>

            {categories.map((category) => (
              <Link
                key={category}
                href={`/san-pham?category=${encodeURIComponent(category)}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
