import { pricingPlans } from "@/data/content";
import Reveal from "@/components/Reveal";

export default function Pricing() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 100}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-6 ${
                  plan.highlighted
                    ? "border-accent bg-surface-2 shadow-[0_0_0_1px_var(--accent)]"
                    : "border-border bg-surface"
                }`}
              >
                {plan.highlighted && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                    Phổ biến nhất
                  </span>
                )}

                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted">{plan.period}</span>
                  )}
                </div>

                <a
                  href="/lien-he"
                  className={`mt-6 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-accent text-white hover:bg-accent-2"
                      : "border border-border text-foreground hover:bg-surface-2"
                  }`}
                >
                  {plan.cta}
                </a>

                <ul className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-muted">
                      <span className="mt-0.5 text-accent-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
