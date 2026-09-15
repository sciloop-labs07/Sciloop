import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface PanelProps extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  glow?: boolean;
}

export function Panel({ children, className, glow = false, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "panel-surface rounded-[28px] p-6 md:p-7",
        glow && "shadow-[0_24px_80px_rgba(88,178,255,0.12)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
