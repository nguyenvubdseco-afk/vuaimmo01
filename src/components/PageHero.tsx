import Reveal from "@/components/Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-16 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted">
          {eyebrow}
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted sm:text-base">{description}</p>
      </Reveal>
    </section>
  );
}
