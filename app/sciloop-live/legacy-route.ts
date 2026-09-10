import { NextRequest, NextResponse } from "next/server";

import { getInnovation, innovations } from "@/data/innovations";
import { getVisualMechanismRecipe, type VisualMechanismRecipe } from "@/lib/visual-mechanism-recipes";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character] ?? character);
}

function renderMechanismSvg(recipe: VisualMechanismRecipe) {
  const positions = [55, 210, 365];
  const nodes = recipe.steps.map((step, index) => `<g><circle class="signal-mechanism-node signal-mechanism-node-${recipe.kind}" cx="${positions[index]}" cy="53" r="22" /><text class="signal-mechanism-index" x="${positions[index]}" y="19" text-anchor="middle">0${index + 1}</text><text class="signal-mechanism-label" x="${positions[index]}" y="107" text-anchor="middle">${escapeHtml(step)}</text></g>`).join("");
  const gradientId = `mechanism-${recipe.slug}`;
  return `<svg class="signal-mechanism-svg signal-mechanism-svg-compact" viewBox="0 0 420 112" role="img" aria-label="${escapeHtml(recipe.accessibleDescription)}"><defs><linearGradient id="${gradientId}" x1="0" x2="1"><stop stop-color="${recipe.accent}" stop-opacity=".2" /><stop offset=".5" stop-color="${recipe.accent}" /><stop offset="1" stop-color="#78a9ff" /></linearGradient></defs><path class="signal-mechanism-flow" d="M 77 53 C 139 11, 126 95, 188 53 S 281 11, 343 53" fill="none" stroke="url(#${gradientId})" stroke-dasharray="5 8" stroke-width="2" />${nodes}</svg>`;
}

function renderSignalCard(slug: string, index: number) {
  const innovation = getInnovation(slug);
  if (!innovation) return "";
  const recipe = getVisualMechanismRecipe(slug);
  if (!recipe) return "";
  return `<article class="signal-card${index === 0 ? " is-selected" : ""}">
    <a class="visual-mechanism" href="/sciloop-live/visual/${escapeHtml(innovation.slug)}" aria-label="See how ${escapeHtml(recipe.label)} works">
      <span class="visual-mechanism-kicker">Visual mechanism</span>
      ${renderMechanismSvg(recipe)}
      <span class="visual-mechanism-cta">See how it works ↗</span>
    </a>
    <button class="signal-card-select" data-signal="${escapeHtml(innovation.slug)}" type="button">
      <span class="signal-field">${escapeHtml(innovation.field)}</span>
      <strong>${escapeHtml(innovation.title)}</strong>
      <span>${escapeHtml(innovation.decision.whyItMatters)}</span>
      <em>${escapeHtml(innovation.decision.nextAction)} →</em>
    </button>
  </article>`;
}

function renderSignalData() {
  return JSON.stringify(Object.fromEntries(innovations.map((innovation) => [innovation.slug, {
    slug: innovation.slug, title: innovation.title, field: innovation.field, source: innovation.source,
    summary: innovation.summary, mechanism: innovation.mechanism, confidence: innovation.decision.confidence,
    nextAction: innovation.decision.nextAction, evidence: innovation.evidence[0],
  }]))).replace(/</g, "\\u003c");
}

function renderPublicHtml(selectedSlug: string) {
  const selected = getInnovation(selectedSlug) ?? innovations[0];
  const signalCards = innovations.map((innovation, index) => renderSignalCard(innovation.slug, index)).join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="SciLoop turns reviewed scientific signals into clear explanations and useful next questions." />
<title>SciLoop · Scientific signals, made useful</title>
<style>
:root{color-scheme:light;--ink:#111827;--muted:#667085;--line:#dfe5ea;--accent:#c9f0ee;--accent-strong:#167b78}*{box-sizing:border-box}html{background:#fbfcfc;scroll-behavior:smooth}body{margin:0;min-width:320px;background:#fbfcfc;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button{font:inherit;cursor:pointer}.page{width:min(1180px,calc(100% - 32px));margin:0 auto}.topbar{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:24px 0 16px}.brand{color:var(--ink);font-size:20px;font-weight:800;letter-spacing:-.05em}.descriptor{color:#78838d;font-size:10px;letter-spacing:.18em;line-height:1.45;text-align:right;text-transform:uppercase}.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(300px,.95fr);gap:48px;align-items:center;padding:76px 0 64px}.eyebrow{color:var(--accent-strong);font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase}h1{max-width:720px;margin:22px 0 18px;font-size:clamp(3rem,7vw,6.6rem);line-height:.94;letter-spacing:-.075em}.lede{max-width:620px;margin:0;color:var(--muted);font-size:clamp(1rem,1.6vw,1.2rem);line-height:1.7}.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center;border-radius:14px;padding:14px 18px;text-decoration:none;font-size:14px;font-weight:750}.primary{background:#152326;color:white}.secondary{border:1px solid var(--line);background:white;color:var(--ink)}.proof{display:flex;flex-wrap:wrap;gap:16px;margin-top:28px;color:#7a858e;font-size:11px;text-transform:uppercase;letter-spacing:.14em}.proof span:before{content:"";display:inline-block;width:7px;height:7px;margin-right:7px;border-radius:50%;background:#43b7a3}.signal-focus{min-height:360px;border:1px solid #cfe2e4;border-radius:28px;padding:28px;background:linear-gradient(145deg,#effafa,#fff 62%);box-shadow:0 24px 70px rgba(25,70,72,.1)}.focus-meta{display:flex;justify-content:space-between;gap:12px;color:var(--accent-strong);font-size:10px;font-weight:800;letter-spacing:.15em;text-transform:uppercase}.signal-focus h2{margin:48px 0 16px;font-size:clamp(1.8rem,3.2vw,2.7rem);line-height:1.04;letter-spacing:-.055em}.focus-copy{margin:0;color:var(--muted);line-height:1.65}.focus-footer{display:flex;justify-content:space-between;gap:18px;margin-top:34px;padding-top:18px;border-top:1px solid #d7e8e9;color:#66747d;font-size:12px}.focus-footer strong{color:var(--accent-strong)}.section{padding:34px 0 84px}.section-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:20px}.section-heading p{max-width:420px;margin:0;color:var(--muted);font-size:14px;line-height:1.6}h2{margin:8px 0 0;font-size:clamp(1.8rem,3vw,3rem);letter-spacing:-.055em}.signals{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.signal-card{min-height:250px;display:flex;flex-direction:column;align-items:flex-start;gap:14px;border:1px solid var(--line);border-radius:22px;padding:22px;background:white;color:var(--ink);text-align:left;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.signal-card:hover,.signal-card:focus-visible,.signal-card.is-selected{border-color:#a6d9d8;box-shadow:0 16px 36px rgba(20,70,73,.08);transform:translateY(-2px)}.signal-field{color:var(--accent-strong);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.signal-card strong{font-size:1.22rem;line-height:1.15;letter-spacing:-.035em}.signal-card span:not(.signal-field){color:var(--muted);font-size:13px;line-height:1.55}.signal-card em{margin-top:auto;color:var(--accent-strong);font-size:12px;font-style:normal;font-weight:800}.detail{display:grid;grid-template-columns:.8fr 1.2fr;gap:36px;border-top:1px solid var(--line);padding-top:38px}.detail h2{max-width:360px}.detail-copy{color:var(--muted);line-height:1.75}.detail-copy p{margin:0 0 14px}.source{display:inline-flex;gap:8px;align-items:center;color:var(--accent-strong);font-size:13px;font-weight:750}.footer{display:flex;justify-content:space-between;gap:20px;padding:26px 0 36px;border-top:1px solid var(--line);color:#89939b;font-size:12px}@media(max-width:800px){.hero,.detail{grid-template-columns:1fr;gap:28px;padding-top:48px}.signals{grid-template-columns:1fr}.signal-card{min-height:190px}.section-heading{display:block}.section-heading p{margin-top:12px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important}}
</style><style>
.signal-card{min-height:250px;display:flex;flex-direction:column;align-items:stretch;gap:14px;border:1px solid var(--line);border-radius:22px;padding:14px;background:white;color:var(--ink);text-align:left;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.signal-card:hover,.signal-card:focus-within,.signal-card.is-selected{border-color:#a6d9d8;box-shadow:0 16px 36px rgba(20,70,73,.08);transform:translateY(-2px)}.visual-mechanism{display:block;border:1px solid #d8e9e8;border-radius:16px;padding:12px;background:linear-gradient(145deg,#f1fbfa,#fff);color:var(--ink);text-decoration:none}.visual-mechanism-kicker{display:block;color:var(--accent-strong);font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}.visual-mechanism-cta{display:block;margin-top:1px;color:var(--accent-strong);font-size:11px;font-weight:800}.signal-mechanism-svg{display:block;width:100%;height:auto}.signal-mechanism-index{fill:#819096;font:700 8px ui-monospace,SFMono-Regular,monospace;letter-spacing:.12em}.signal-mechanism-label{fill:#27343a;font:600 10px Inter,ui-sans-serif,system-ui,sans-serif}.signal-mechanism-node{stroke:#fff;stroke-width:2}.signal-mechanism-node-quantum{fill:#b9e9e6}.signal-mechanism-node-biology{fill:#f1d2aa}.signal-mechanism-node-energy{fill:#b9e4c4}.signal-mechanism-flow{animation:mechanismFlow 2.8s linear infinite}.signal-card-select{display:flex;min-height:148px;flex:1;flex-direction:column;align-items:flex-start;gap:11px;border:0;background:transparent;color:var(--ink);padding:8px;text-align:left}.signal-card-select:focus-visible{outline:2px solid var(--accent-strong);outline-offset:3px}.signal-field{color:var(--accent-strong);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.signal-card strong{font-size:1.18rem;line-height:1.15;letter-spacing:-.035em}.signal-card-select>span:not(.signal-field){color:var(--muted);font-size:13px;line-height:1.55}.signal-card em{margin-top:auto;color:var(--accent-strong);font-size:12px;font-style:normal;font-weight:800}@keyframes mechanismFlow{to{stroke-dashoffset:-26}}@media(max-width:800px){.signal-card{min-height:190px}}@media(prefers-reduced-motion:reduce){.signal-mechanism-flow{animation:none}}
</style></head><body><main><div class="page">
<header class="topbar"><a class="brand" href="/sciloop-live">SciLoop</a><div class="descriptor">Scientific intelligence<br />for clearer thinking</div></header>
<section class="hero" aria-labelledby="page-title"><div><div class="eyebrow">SciLoop · reviewed signal</div><h1 id="page-title">See what changed. Understand why it matters.</h1><p class="lede">SciLoop turns important scientific developments into clear explanations, visible mechanisms, and one useful next question.</p><div class="hero-actions"><a class="primary" href="#signals">Explore signals ↓</a><a class="secondary" href="/sciloop-live/physics">Explore Physics Visual Language</a><a class="secondary" href="#selected-signal">Read this signal</a></div><div class="proof"><span>Source-linked</span><span>Human decision required</span></div></div>
<article class="signal-focus" id="selected-signal" aria-live="polite"><div class="focus-meta"><span id="focus-field">${escapeHtml(selected.field)}</span><span id="focus-confidence">${escapeHtml(selected.decision.confidence)}</span></div><h2 id="focus-title">${escapeHtml(selected.title)}</h2><p class="focus-copy" id="focus-summary">${escapeHtml(selected.summary)}</p><div class="focus-footer"><span>Next useful action<br /><strong id="focus-action">${escapeHtml(selected.decision.nextAction)}</strong></span><span>Evidence<br /><strong id="focus-source">${escapeHtml(selected.evidence[0]?.publisher ?? selected.source)}</strong></span></div></article></section>
<section class="section" id="signals" aria-labelledby="signals-title"><div class="section-heading"><div><div class="eyebrow">Humanity · today</div><h2 id="signals-title">Start with a signal.</h2></div><p>Reviewed stories keep facts, mechanisms, uncertainty, and next questions distinct.</p></div><div class="signals">${signalCards}</div></section>
<section class="detail" aria-labelledby="meaning-title"><div><div class="eyebrow">How SciLoop helps</div><h2 id="meaning-title">From evidence to a better question.</h2></div><div class="detail-copy"><p id="focus-mechanism">${escapeHtml(selected.mechanism)}</p><a id="focus-evidence" class="source" href="${escapeHtml(selected.evidence[0]?.url ?? "#")}" target="_blank" rel="noreferrer">Read the source ↗</a></div></section>
<footer class="footer"><span>SciLoop · Scientific intelligence for decisions</span><span>No prediction guarantees.</span></footer></div></main>
<script type="application/json" id="sciloop-signal-data">${renderSignalData()}</script><script>(()=>{const data=JSON.parse(document.getElementById('sciloop-signal-data').textContent);const set=(id,value)=>{const node=document.getElementById(id);if(node)node.textContent=value};document.querySelectorAll('[data-signal]').forEach(button=>button.addEventListener('click',()=>{const signal=data[button.dataset.signal];if(!signal)return;document.querySelectorAll('[data-signal]').forEach(item=>item.classList.toggle('is-selected',item===button));set('focus-field',signal.field);set('focus-confidence',signal.confidence);set('focus-title',signal.title);set('focus-summary',signal.summary);set('focus-action',signal.nextAction);set('focus-source',signal.evidence.publisher);set('focus-mechanism',signal.mechanism);const evidence=document.getElementById('focus-evidence');if(evidence)evidence.href=signal.evidence.url;document.getElementById('selected-signal').scrollIntoView({behavior:'smooth',block:'center'})}))})()</script></body></html>`;
}

export async function GET(request: NextRequest) {
  const requestedSlug = request.nextUrl.searchParams.get("signal") ?? innovations[0].slug;
  return new NextResponse(renderPublicHtml(requestedSlug), { headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300", "content-type": "text/html; charset=utf-8", "x-sciloop-surface": "public-launch" } });
}
