"use client";

import { useState } from "react";
import { promptCategories, promptStats, prompts } from "@/data/prompts";
import Reveal from "@/components/Reveal";

export default function PromptLibrary() {
  const [activeCategory, setActiveCategory] = useState(promptCategories[0]);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  const visiblePrompts =
    activeCategory === "Tất cả"
      ? prompts
      : prompts.filter((p) => p.category === activeCategory);

  async function copyTemplate(title: string, template: string) {
    try {
      await navigator.clipboard.writeText(template);
      setCopiedTitle(title);
      setTimeout(() => setCopiedTitle((current) => (current === title ? null : current)), 2000);
    } catch {
      // Trình duyệt chặn clipboard (vd. không phải HTTPS) — bỏ qua, người dùng có thể tự bôi đen copy.
    }
  }

  return (
    <>
      <Reveal>
        <dl className="mx-auto grid max-w-lg grid-cols-4 gap-4 px-6 pb-4">
          {promptStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-xl font-bold sm:text-2xl">{stat.value}</dd>
              <p className="mt-1 text-[11px] text-muted sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </dl>
      </Reveal>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-wrap justify-center gap-2">
            {promptCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  activeCategory === category
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-surface text-muted hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePrompts.map((prompt, i) => (
              <Reveal key={prompt.title} delay={(i % 3) * 90}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted">
                      {prompt.category}
                    </span>
                    {prompt.isNew && (
                      <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
                        Mới
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-sm font-semibold sm:text-base">{prompt.title}</h3>
                  <p className="mt-1.5 text-xs text-muted sm:text-sm">{prompt.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {prompt.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-md bg-surface-2 px-2 py-1 text-[11px] text-muted"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <pre className="mt-4 flex-1 whitespace-pre-wrap rounded-xl bg-background p-3 text-[11px] leading-relaxed text-muted">
                    {prompt.template}
                  </pre>

                  <button
                    type="button"
                    onClick={() => copyTemplate(prompt.title, prompt.template)}
                    className="mt-4 w-full rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {copiedTitle === prompt.title ? "Đã sao chép ✓" : "Sao chép prompt"}
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
