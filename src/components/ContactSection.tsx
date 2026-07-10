"use client";

import { useActionState } from "react";
import { contactForm } from "@/data/content";
import type { SiteContent } from "@/lib/store";
import Reveal from "@/components/Reveal";
import { submitContactForm, type ContactFormState } from "@/app/lien-he/actions";

const initialState: ContactFormState = { success: false };

export default function ContactSection({ contact }: { contact: SiteContent["contact"] }) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="flex flex-col gap-6">
            {contact.info.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          {state.success ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center">
              <p className="text-lg font-semibold">Đã gửi yêu cầu thành công!</p>
              <p className="mt-2 text-sm text-muted">
                Đội ngũ của chúng tôi sẽ liên hệ lại với bạn sớm nhất.
              </p>
            </div>
          ) : (
            <form
              action={formAction}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
            >
              {contactForm.formFields.map((field) => (
                <label key={field.name} className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium">{field.label}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.name !== "phone"}
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                  />
                </label>
              ))}

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">{contactForm.messageLabel}</span>
                <textarea
                  name="message"
                  placeholder={contactForm.messagePlaceholder}
                  required
                  rows={4}
                  className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                />
              </label>

              {state.error && <p className="text-sm text-red-400">{state.error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Đang gửi..." : contactForm.submitLabel}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
