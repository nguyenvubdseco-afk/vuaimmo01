import Link from "next/link";
import { gradients } from "@/data/content";
import type { Product } from "@/lib/store";
import Reveal from "@/components/Reveal";

export default function DownloadTools({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section id="downloads" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Tool AI tải về, dùng ngay trên{" "}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              máy bạn
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
            Sản phẩm miễn phí từ mục Quà Tặng — tải về và dùng ngay, không mất phí.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => {
            const downloadUrl = product.externalDownloadUrl || product.softwareFile;
            const isExternal = Boolean(product.externalDownloadUrl);

            return (
              <Reveal key={product.id} delay={(i % 3) * 100}>
                <div className="flex flex-col rounded-2xl border border-border bg-surface p-5">
                  <div className="flex items-center gap-3">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradients[(i + 4) % gradients.length]} text-sm font-bold text-white`}
                      >
                        {product.name.slice(-2)}
                      </span>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold">{product.name}</h3>
                      <p className="text-xs text-muted">{product.category}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-muted">{product.tagline}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm font-semibold text-accent-2">Miễn phí</span>
                    {downloadUrl ? (
                      <a
                        href={downloadUrl}
                        download={isExternal ? undefined : (product.softwareFileName ?? undefined)}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
                      >
                        Tải về
                      </a>
                    ) : (
                      <Link
                        href={`/san-pham/${product.id}`}
                        className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
                      >
                        Xem chi tiết
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
