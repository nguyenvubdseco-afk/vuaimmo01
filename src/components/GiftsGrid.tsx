import Link from "next/link";
import { gradients } from "@/data/content";
import type { Product } from "@/lib/store";
import Reveal from "@/components/Reveal";

export default function GiftsGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted">
            Hiện chưa có quà tặng nào. Quay lại sau nhé!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => {
            const downloadUrl = product.externalDownloadUrl || product.softwareFile;
            const isExternal = Boolean(product.externalDownloadUrl);

            return (
              <Reveal key={product.id} delay={(i % 4) * 80}>
                <article className="group flex flex-col rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/60">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-28 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className={`flex h-28 items-center justify-center rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]}`}
                    >
                      <span className="text-3xl font-bold text-white/90">
                        {product.name.slice(-2)}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold">{product.name}</h3>
                    <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                      Miễn phí
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-muted">{product.tagline}</p>

                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      download={isExternal ? undefined : (product.softwareFileName ?? undefined)}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-center text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <span aria-hidden>⬇</span>
                      Tải về miễn phí
                    </a>
                  ) : (
                    <Link
                      href={`/san-pham/${product.id}`}
                      className="mt-4 flex w-full items-center justify-center rounded-full border border-border px-4 py-2 text-center text-xs font-medium text-foreground transition-colors group-hover:border-accent group-hover:text-accent-2"
                    >
                      Xem chi tiết
                    </Link>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
