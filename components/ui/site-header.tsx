"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type IconName = "overview" | "signals" | "visual" | "lab" | "workbench" | "engine" | "method";
type NavItem = { href: string; label: string; detail: string; icon: IconName; group: "Explore" | "Workbench" };

const navItems: NavItem[] = [
  { href: "/", label: "Overview", detail: "SciLoop home", icon: "overview", group: "Explore" },
  { href: "/live-innovations", label: "Decision signals", detail: "Reviewed signals", icon: "signals", group: "Explore" },
  { href: "/sciloop-live/physics", label: "Visual language", detail: "Physics mechanisms", icon: "visual", group: "Explore" },
  { href: "/live-innovations#method", label: "Method", detail: "How signals are reviewed", icon: "method", group: "Explore" },
  { href: "/workbench", label: "Workbench", detail: "Protected capability studio", icon: "workbench", group: "Workbench" },
  { href: "/mini-experiment-lab", label: "Experiment lab", detail: "Interactive research preview", icon: "lab", group: "Workbench" },
  { href: "/visual-frontier/visual-engine-demo", label: "Visual engine", detail: "Renderer and recipe lab", icon: "engine", group: "Workbench" },
];

function NavIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "overview") return <svg {...common}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></svg>;
  if (name === "signals") return <svg {...common}><path d="M3 12h3l2-6 4 12 2-6h7" /><circle cx="19" cy="6" r="2" /></svg>;
  if (name === "visual") return <svg {...common}><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" /></svg>;
  if (name === "method") return <svg {...common}><path d="M4 5h16M4 12h10M4 19h16" /><circle cx="18" cy="12" r="2" /></svg>;
  if (name === "workbench") return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h4M15 12h2M7 16h6" /></svg>;
  if (name === "lab") return <svg {...common}><path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3" /><path d="M8 15h8" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v8M8 12h8" /><path d="m17 7 2-2" /></svg>;
}

function isActivePath(pathname: string, href: string) {
  const path = href.split("#")[0];
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

function RailItem({ item, pathname, expanded, onNavigate }: { item: NavItem; pathname: string; expanded: boolean; onNavigate?: () => void }) {
  const active = isActivePath(pathname, item.href);
  return (
    <Link href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={cn("group/item relative flex min-h-11 items-center gap-3 rounded-2xl border px-3 text-sm transition-[background,border-color,color,transform] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200", active ? "border-cyan-200/30 bg-cyan-200/12 text-white shadow-[0_0_24px_rgba(103,232,249,0.08)]" : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white", expanded ? "justify-start" : "justify-center")} title={expanded ? undefined : item.label}>
      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors", active ? "bg-cyan-200/15 text-cyan-100" : "bg-white/[0.04] text-slate-400 group-hover/item:text-cyan-100")}><NavIcon name={item.icon} size={18} /></span>
      <span className={cn("min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-300", expanded ? "max-w-44 translate-x-0 opacity-100" : "pointer-events-none max-w-0 -translate-x-2 opacity-0")}><span className="block font-medium">{item.label}</span>{expanded ? <span className="mt-0.5 block text-[10px] text-slate-500">{item.detail}</span> : null}</span>
      {active ? <span className="absolute -left-px top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-cyan-200" /> : null}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const expanded = hovered || pinned;
  const groupedItems = useMemo(() => ({ Explore: navItems.filter((item) => item.group === "Explore"), Workbench: navItems.filter((item) => item.group === "Workbench") }), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { setHovered(false); setMobileOpen(false); } };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <aside className={cn("fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] flex-col rounded-[28px] border border-white/10 bg-slate-950/80 p-3 shadow-[0_24px_90px_rgba(2,8,23,0.36)] backdrop-blur-xl transition-[width,box-shadow,border-color] duration-300 ease-out md:flex", expanded ? "w-64 border-cyan-200/20 shadow-[0_24px_100px_rgba(2,8,23,0.5)]" : "w-[4.5rem]")} aria-label="SciLoop navigation" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)}>
        <div className={cn("flex items-center gap-3 border-b border-white/10 pb-3", expanded ? "px-1" : "justify-center")}><Link href="/" className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-xs font-semibold text-cyan-100" aria-label="SciLoop overview">SL</Link><span className={cn("overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300", expanded ? "max-w-40 opacity-100" : "max-w-0 opacity-0")}><span className="block font-display text-base font-semibold text-white">SciLoop</span><span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500">Scientific intelligence</span></span></div>
        <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto" aria-label="Primary navigation">{(Object.keys(groupedItems) as Array<keyof typeof groupedItems>).map((group) => <div key={group} className="space-y-1"><p className={cn("mb-2 overflow-hidden px-3 text-[9px] uppercase tracking-[0.22em] text-slate-600 transition-[max-width,opacity] duration-300", expanded ? "max-w-44 opacity-100" : "max-w-0 opacity-0")}>{group}</p>{groupedItems[group].map((item) => <RailItem key={item.href} item={item} pathname={pathname} expanded={expanded} />)}</div>)}</nav>
        <div className={cn("mt-3 border-t border-white/10 pt-3", expanded ? "" : "flex justify-center")}><button type="button" aria-label={pinned ? "Unpin expanded navigation" : "Pin expanded navigation"} aria-pressed={pinned} onClick={() => setPinned((value) => !value)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-400 transition-colors hover:border-cyan-200/25 hover:text-cyan-100 focus-visible:outline-2 focus-visible:outline-cyan-200" title={pinned ? "Unpin navigation" : "Keep navigation expanded"}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 3 6 6-3 3 5 5-2 2-5-5-3 3-6-6 3-3-1-1 2-2 1 1 3-3Z" /><path d="M5 19 3 21" /></svg></button></div>
      </aside>

      <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">{mobileOpen ? <div id="mobile-navigation" role="dialog" aria-label="Expanded SciLoop navigation" className="mb-3 rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-[0_24px_90px_rgba(2,8,23,0.55)] backdrop-blur-xl"><div className="mb-2 flex items-center justify-between px-2"><span className="text-xs font-semibold text-white">SciLoop navigation</span><button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-200">Close</button></div><nav className="grid gap-1" aria-label="Mobile navigation">{navItems.map((item) => <RailItem key={item.href} item={item} pathname={pathname} expanded onNavigate={() => setMobileOpen(false)} />)}</nav></div> : null}<nav className="flex items-center justify-around rounded-3xl border border-white/10 bg-slate-950/90 p-2 shadow-[0_18px_60px_rgba(2,8,23,0.45)] backdrop-blur-xl" aria-label="Mobile primary navigation">{navItems.slice(0, 4).map((item) => <RailItem key={item.href} item={item} pathname={pathname} expanded={false} onNavigate={() => setMobileOpen(false)} />)}<button type="button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-2xl border border-transparent text-slate-400 hover:border-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-200"><span className="text-lg leading-none">•••</span></button></nav></div>
    </>
  );
}
