import { heroStats } from "@/data/content";
import type { SiteContent } from "@/lib/store";
import Reveal from "@/components/Reveal";

export default function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-20 sm:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted">
            {hero.eyebrow}
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {hero.headline}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              {hero.headlineHighlight}
            </span>
            {hero.headlineEnd}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg">
            {hero.description}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#products"
              className="w-full rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-2 sm:w-auto"
            >
              {hero.primaryCta}
            </a>
            <a
              href="#features"
              className="w-full rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <dl className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-10">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-bold sm:text-3xl">{stat.value}</dd>
                <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
