import Link from "next/link";
import type { NavItem } from "@/lib/types";

export default function SiteHeader({ name, title, nav }: { name: string; title: string; nav: NavItem[] }) {
  return (
    <header className="border-b border-sand-200 bg-sand-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-2xl font-display text-ink-900">
            {name}
          </Link>
          <p className="text-sm text-ink-500">{title}</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm font-semibold text-ink-700">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-accent-600">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
