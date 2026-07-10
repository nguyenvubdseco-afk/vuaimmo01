import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/content";
import { isAdminAuthenticated } from "@/lib/auth";
import { logout } from "@/app/admin/actions";
import ProductsNavDropdown from "@/components/ProductsNavDropdown";

export default async function Navbar() {
  const authenticated = await isAdminAuthenticated();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-icon.png"
            alt={siteConfig.brand}
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg object-cover"
            priority
          />
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-[11.7px] font-semibold tracking-tight text-transparent">
            {siteConfig.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) =>
            item.label === "Sản phẩm" ? (
              <ProductsNavDropdown key={item.href} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          {authenticated ? (
            <>
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent-2"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  A
                </span>
                Quản trị viên
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  Đăng xuất
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/admin/login"
              className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent-2"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
