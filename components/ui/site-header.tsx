"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/live-innovations", label: "Decision signals" },
  { href: "/live-innovations#method", label: "Method" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 px-0 pt-5 md:pt-7">
      <div className="page-shell">
        <div className="panel-surface flex flex-col gap-4 rounded-full px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
            <Link href="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-200/18 bg-cyan-200/10 text-sm text-cyan-100 shadow-[0_0_24px_rgba(143,233,255,0.16)]">
              SL
            </div>
            <div>
              <div className="font-display text-lg font-semibold tracking-wide text-white">
                SciLoop
              </div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                Scientific intelligence for decisions
              </div>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                    active
                      ? "border-cyan-200/40 bg-cyan-200/12 text-white"
                      : "border-white/10 bg-white/0 text-slate-300 hover:border-cyan-200/25 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
