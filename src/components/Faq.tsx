"use client";

import { useState } from "react";
import { faqs as defaultFaqs } from "@/data/content";
import Reveal from "@/components/Reveal";

type FaqItem = { question: string; answer: string };

type FaqProps = {
  items?: FaqItem[];
  title?: React.ReactNode;
  withSectionId?: boolean;
};

export default function Faq({
  items = defaultFaqs,
  title = (
    <>
      Bạn có thắc mắc?{" "}
      <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
        Chúng tôi có câu trả lời
      </span>
    </>
  ),
  withSectionId = true,
}: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={withSectionId ? "faq" : undefined} className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3">
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.question} delay={index * 60}>
                <div className="rounded-2xl border border-border bg-surface">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium sm:text-base"
                    aria-expanded={isOpen}
                  >
                    {faq.question}
                    <span
                      className={`shrink-0 text-lg text-muted transition-transform ${isOpen ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-4 text-sm text-muted">{faq.answer}</p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
