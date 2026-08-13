"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { innovations, slugifyInnovation } from "@/data/innovations";

type FeedArticle = { title: string; summary?: string; source?: string; url?: string; subject?: string; category?: string; publishedAt?: string; slug?: string };

function articleHref(article: FeedArticle) {
  const slug = article.slug ?? slugifyInnovation(article.title);
  const params = new URLSearchParams();
  if (!article.slug) { params.set("title", article.title); if (article.summary) params.set("summary", article.summary); if (article.source) params.set("source", article.source); if (article.url) params.set("sourceUrl", article.url); }
  return `/innovations/${slug}${params.size ? `?${params.toString()}` : ""}`;
}

export function LiveInnovationPortal() {
  const [articles, setArticles] = useState<FeedArticle[]>(innovations.map((item) => ({ title: item.title, summary: item.summary, source: item.source, subject: item.field, category: "Live innovation", slug: item.slug })));
  const [query, setQuery] = useState("");
  const [field, setField] = useState("All fields");
  const [status, setStatus] = useState("Curating the latest signals…");
  const [loading, setLoading] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get("q");
    if (initialQuery) setQuery(initialQuery);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 7000);
    fetch("/api/sciloop-ai-proxy/news?topic=science&limit=18&aiLimit=0", { cache: "no-store", signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error("feed unavailable"); return response.json() as Promise<{ articles?: FeedArticle[]; count?: number; stale?: boolean }>; })
      .then((payload) => { if (Array.isArray(payload.articles) && payload.articles.length) { setArticles([...articles, ...payload.articles]); setStatus(`${payload.count ?? payload.articles.length} live signals${payload.stale ? " · cached" : ""}`); } else setStatus("Three editorial signals ready to explore."); })
      .catch(() => setStatus("Live feed warming up · editorial signals are ready to explore."))
      .finally(() => { window.clearTimeout(timer); setLoading(false); });
    return () => { controller.abort(); window.clearTimeout(timer); };
    // The seed set is intentionally captured once for a predictable first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  const fields = useMemo(() => ["All fields", ...Array.from(new Set(articles.map((article) => article.subject).filter(Boolean) as string[]))], [articles]);
  const filtered = useMemo(() => articles.filter((article) => {
    const matchesField = field === "All fields" || article.subject === field;
    const detail = article.slug ? innovations.find((item) => item.slug === article.slug) : undefined;
    const haystack = `${article.title} ${article.summary ?? ""} ${article.subject ?? ""} ${detail?.scientists.map((item) => item.name).join(" ") ?? ""} ${detail?.technology.map((item) => item.label).join(" ") ?? ""} ${detail?.organizations.join(" ") ?? ""}`.toLowerCase();
    return matchesField && haystack.includes(query.toLowerCase().trim());
  }), [articles, field, query]);

  return <main className="page-shell pb-20 pt-5 md:pt-12">
    <section className="feed-hero relative overflow-hidden rounded-[40px] border border-white/10 px-6 py-12 md:px-12 md:py-16">
      <div className="hero-grid" aria-hidden="true" />
      <div className="relative z-10 max-w-4xl"><div className="eyebrow">SciLoop · live innovation</div><h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.04em] text-white md:text-7xl">Discover what is changing the future.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Every signal opens into one continuous story: understand the breakthrough, meet the people behind it, explore how it works, and imagine what comes next.</p></div>
      <div className="relative z-10 mt-9 max-w-3xl"><label htmlFor="innovation-search" className="sr-only">Search innovations, scientists, and technologies</label><div className="search-shell"><span aria-hidden="true">⌕</span><input ref={searchRef} id="innovation-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search innovations, scientists, technologies…" /><kbd>⌘ K</kbd></div></div>
    </section>
    <section className="mt-10"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="eyebrow">Humanity · live activity</div><h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">Explore what is changing the future.</h2><p className="mt-2 text-sm text-slate-500">{loading ? "Loading the live stream…" : status}</p></div><div className="flex max-w-full gap-2 overflow-x-auto pb-1">{fields.map((item) => <button key={item} type="button" onClick={() => setField(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs transition-colors ${field === item ? "border-cyan-200/35 bg-cyan-200/10 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}>{item}</button>)}</div></div>
      {filtered.length ? <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((article, index) => <Link key={`${article.title}-${index}`} href={articleHref(article)} className="innovation-feed-card panel-surface group flex min-h-80 flex-col rounded-[28px] border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between gap-3"><span className="chip rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]"><span className="chip-dot" />{article.subject ?? "Science"}</span><span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{article.category ?? "Signal"}</span></div><h2 className="mt-8 font-display text-2xl font-semibold leading-tight text-white group-hover:text-cyan-100">{article.title}</h2><p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-400">{article.summary ?? "Open this innovation to see the mechanism, history, people, and future possibilities."}</p><div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-500"><span>{article.source ?? "SciLoop signal"}</span><span className="text-cyan-100">Explore story →</span></div></Link>)}</div> : <div className="panel-surface mt-8 rounded-[28px] p-10 text-center"><h2 className="font-display text-2xl text-white">No innovation matches that search.</h2><p className="mt-2 text-sm text-slate-400">Try a field, scientist, or technology.</p></div>}
    </section>
  </main>;
}
