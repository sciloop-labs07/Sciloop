import Link, { type LinkProps } from "next/link";
import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface ButtonLinkProps extends LinkProps, PropsWithChildren {
  className?: string;
  variant?: "primary" | "secondary";
}

export function ButtonLink({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60",
        variant === "primary"
          ? "border border-cyan-200/30 bg-linear-to-r from-cyan-300/20 via-cyan-200/10 to-amber-200/12 text-white shadow-[0_18px_44px_rgba(0,0,0,0.24)]"
          : "border border-white/12 bg-white/5 text-slate-100",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
