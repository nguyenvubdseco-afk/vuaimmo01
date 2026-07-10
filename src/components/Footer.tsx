import Link from "next/link";
import Image from "next/image";
import { footer, siteConfig } from "@/data/content";
import Reveal from "@/components/Reveal";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-14">
      <Reveal className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo-icon.png"
                alt={siteConfig.brand}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-[11.7px] font-semibold tracking-tight text-transparent">
                {siteConfig.brand}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">{footer.description}</p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted">
          {footer.copyright}
        </div>
      </Reveal>
    </footer>
  );
}
