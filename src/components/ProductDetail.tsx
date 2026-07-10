import Link from "next/link";
import type { Product } from "@/lib/store";
import Reveal from "@/components/Reveal";
import ProductPurchaseCard from "@/components/ProductPurchaseCard";

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-10 pt-8 sm:pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <Reveal>
              <Link
                href={`/san-pham?category=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
              >
                ← Tất cả {product.category}
              </Link>
            </Reveal>

            <Reveal delay={60}>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {product.isNew && (
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                    Mới
                  </span>
                )}
                {product.trialDays > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <span aria-hidden>⏱</span>
                    Dùng thử miễn phí {product.trialDays} ngày
                  </span>
                )}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-4 flex items-center gap-3">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white/90">
                    {product.name.slice(-2)}
                  </div>
                )}
                <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
              </div>
              {product.tagline && (
                <p className="mt-2 text-base font-medium text-accent-2">{product.tagline}</p>
              )}
            </Reveal>

            {product.description && (
              <Reveal delay={180}>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                  {product.description}
                </p>
              </Reveal>
            )}

            <Reveal delay={240}>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1 text-sm text-muted">
                  ★ {product.rating}
                </span>
                {product.guideUrl && (
                  <a
                    href={product.guideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-2 transition-colors hover:text-accent"
                  >
                    <span aria-hidden>📖</span>
                    Đọc hướng dẫn sử dụng chi tiết trên blog
                    <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <ProductPurchaseCard product={product} />
          </Reveal>
        </div>
      </section>

      {product.features.length > 0 && (
        <section className="px-6 py-10">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-xl font-bold sm:text-2xl">Tính năng nổi bật</h2>
            </Reveal>
            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {product.features.map((feature, i) => (
                <Reveal key={feature} delay={(i % 2) * 80}>
                  <div className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] text-accent-2">
                      ✓
                    </span>
                    <span className="text-muted">{feature}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {product.usageSteps.length > 0 && (
        <section className="px-6 py-10 pb-20">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-xl font-bold sm:text-2xl">Cách sử dụng</h2>
            </Reveal>
            <ol className="mt-6 flex flex-col gap-4">
              {product.usageSteps.map((step, i) => (
                <Reveal key={step} delay={i * 60}>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-muted">{step}</span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}
    </>
  );
}
