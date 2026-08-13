import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const MAIN_HTML_FILE = "SciLoop - Live Scientific Discoveries 80.html";

function buildShareConfig(request: NextRequest) {
  const origin = request.nextUrl.origin;
  return {
    aiBackendUrl: `${origin}/api/sciloop-ai-proxy`,
    // QP enters through the protected ForLoop orchestration path. The direct
    // route remains available as an emergency local fallback in the UI.
    possibilitiesUrl: `${origin}/api/forloop-proxy/quantum-possibilities/run`,
    possibilitiesDirectUrl: `${origin}/api/possibilities`,
    // The canonical public UI owns this feature now; allow an explicit `0`
    // only for diagnostics, while keeping normal users on the working path.
    quantumPossibilitiesPipeline: request.nextUrl.searchParams.get("quantumPreview") !== "0",
    forloopBackendUrl: `${origin}/api/forloop-proxy`,
    // Keep bridge links inside the canonical single-page product surface.
    visualLanguageLabUrl: `${origin}/sciloop-live#visual-language`,
    futureLensUrl: `${origin}/sciloop-live#knowledge-frontier/potential-explorer`,
  };
}

function buildKernelBridge() {
  return `<details id="sciloopKernelBridge" open style="position:sticky;top:0;z-index:99998;margin:0 auto;padding:10px 16px;background:linear-gradient(90deg,#071b2e,#111c3e);color:#e0f2fe;font:500 13px system-ui;box-shadow:0 10px 30px rgba(0,0,0,.22)">
  <summary style="cursor:pointer;max-width:1180px;margin:0 auto;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:12px">
    <span><strong style="color:#fff">SciLoop Kernel Bridge</strong> · intelligence is now connected to the main public UI</span>
    <span style="color:#a5f3fc">Evaluate a signal ↓</span>
  </summary>
  <form id="sciloopKernelForm" style="max-width:1180px;margin:10px auto 0;display:flex;flex-wrap:wrap;gap:8px">
    <input id="sciloopKernelInput" aria-label="Innovation or scientific question" placeholder="Paste an innovation, question, or discovery to evaluate…" style="flex:1;min-width:240px;border:1px solid rgba(165,243,252,.25);border-radius:12px;background:rgba(0,0,0,.25);color:#fff;padding:10px 12px;outline:none" />
    <button type="submit" style="border:0;border-radius:12px;background:#cffafe;color:#082f49;font-weight:700;padding:10px 16px;cursor:pointer">Run Future Lens</button>
  </form>
  <div id="sciloopKernelStatus" style="max-width:1180px;margin:8px auto 0;color:#94a3b8">Kernel ready. This bridge is backed by the same planner and evaluator used by SciLoop Studio.</div>
  <div id="sciloopKernelResult" style="max-width:1180px;margin:10px auto 0;display:none"></div>
  <script>
    (() => {
      const form = document.getElementById('sciloopKernelForm');
      const input = document.getElementById('sciloopKernelInput');
      const status = document.getElementById('sciloopKernelStatus');
      const result = document.getElementById('sciloopKernelResult');
      if (!form || !input || !status || !result) return;
      const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char]));
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const value = input.value.trim();
        if (value.length < 3) { status.textContent = 'Enter a meaningful innovation or question first.'; return; }
        status.textContent = 'Kernel is interpreting the requirement and evaluating the signal…';
        result.style.display = 'none';
        try {
          const [planResponse, evaluationResponse] = await Promise.all([
            fetch('/api/kernel/plan', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ input:value }) }),
            fetch('/api/kernel/evaluate-innovation', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ title:value, summary:value, source:'Main SciLoop UI' }) })
          ]);
          const plan = await planResponse.json();
          const evaluation = await evaluationResponse.json();
          const steps = Array.isArray(plan.plan?.steps) ? plan.plan.steps : [];
          const lens = evaluation.evaluation;
          result.innerHTML = '<div style="display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:12px;align-items:start;padding:14px;border:1px solid rgba(165,243,252,.2);border-radius:16px;background:rgba(8,47,73,.32)">' +
            '<div><div style="color:#67e8f9;text-transform:uppercase;letter-spacing:.16em;font-size:10px">Optimized workflow</div><div style="margin-top:8px;color:#fff;font-weight:700">' + esc(plan.plan?.strategy || 'explanation-first') + '</div><ol style="margin:8px 0 0;padding-left:20px;color:#cbd5e1;line-height:1.7">' + steps.map((step) => '<li>' + esc(step.label) + '</li>').join('') + '</ol></div>' +
            '<div style="padding:12px;border-radius:14px;background:rgba(0,0,0,.2);text-align:center"><div style="color:#67e8f9;text-transform:uppercase;letter-spacing:.16em;font-size:10px">Future Lens</div><div style="margin-top:6px;color:#fff;font-size:32px;font-weight:800">' + esc(lens?.overallScore ?? '—') + '<span style="font-size:14px;color:#94a3b8">/100</span></div><div style="margin-top:6px;color:#fef3c7;font-size:12px">Next: ' + esc(lens?.nextAction || 'read-source') + '</div></div></div>';
          result.style.display = 'block';
          status.textContent = 'Evaluation complete. Continue through the main portal, Visual Language, or Mini Experiment Lab.';
        } catch (error) {
          status.textContent = 'Kernel bridge unavailable right now; the main SciLoop portals remain available.';
        }
      });
    })();
  </script>
</details>`;
}

function buildExperimentLabBridge() {
  return `<section id="sciloopExperimentLab" aria-label="SciLoop Cognitive Experiment Lab" style="max-width:1180px;margin:20px auto;padding:18px;border:1px solid rgba(103,232,249,.24);border-radius:22px;background:linear-gradient(135deg,rgba(7,27,46,.97),rgba(15,23,42,.97));color:#e0f2fe;font:500 13px system-ui;box-shadow:0 18px 50px rgba(2,8,23,.26)">
  <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap"><div><div style="color:#67e8f9;text-transform:uppercase;letter-spacing:.18em;font-size:10px">Cognitive Experiment Lab · API-backed</div><h2 id="sciloopExperimentTitle" style="margin:6px 0 4px;color:#fff;font-size:22px">Loading experiments…</h2><p id="sciloopExperimentQuestion" style="margin:0;color:#94a3b8;max-width:760px">Select a scientific system, manipulate variables, and see the effects inside the lab.</p></div><button id="sciloopExperimentRun" type="button" style="border:0;border-radius:12px;background:#cffafe;color:#082f49;font-weight:800;padding:11px 16px;cursor:pointer">Run Cognitive Lab</button></div>
  <label style="display:block;margin-top:14px;color:#a5f3fc">Experiment subject <select id="sciloopExperimentSelect" style="display:block;width:100%;margin-top:6px;border:1px solid rgba(165,243,252,.24);border-radius:10px;background:#0f172a;color:#fff;padding:10px"></select></label>
  <div id="sciloopExperimentControls" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:14px"></div>
  <div id="sciloopExperimentStatus" style="margin-top:12px;color:#a5f3fc">Connecting to the Experiment Lab API…</div><div id="sciloopExperimentResult" style="display:none;margin-top:14px"></div>
  <script>(() => { const $ = (id) => document.getElementById(id); const select = $('sciloopExperimentSelect'), controls = $('sciloopExperimentControls'), status = $('sciloopExperimentStatus'), result = $('sciloopExperimentResult'), runButton = $('sciloopExperimentRun'); let experiments = [], active = null; const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); const title = (value) => String(value).replaceAll('-', ' '); const card = (heading, body) => '<div style="padding:12px;border:1px solid rgba(165,243,252,.16);border-radius:15px;background:rgba(2,8,23,.28)"><div style="color:#67e8f9;text-transform:uppercase;letter-spacing:.14em;font-size:10px">' + esc(heading) + '</div><div style="margin-top:7px;color:#dbeafe;line-height:1.55">' + body + '</div></div>'; function showDefinition() { active = experiments.find((item) => item.id === select.value); if (!active) return; $('sciloopExperimentTitle').textContent = active.title; $('sciloopExperimentQuestion').textContent = active.question; controls.innerHTML = active.variables.map((item) => '<label>' + esc(item.label) + ' <span id="sciloopValue-' + esc(item.id) + '" style="color:#fff">' + esc(item.value) + ' ' + esc(item.unit) + '</span><input data-variable="' + esc(item.id) + '" type="range" min="' + item.min + '" max="' + item.max + '" step="' + item.step + '" value="' + item.value + '" style="display:block;width:100%;margin-top:7px"></label>').join(''); controls.querySelectorAll('input[data-variable]').forEach((input) => input.addEventListener('input', () => { const output = $('sciloopValue-' + input.dataset.variable); if (output) output.textContent = input.value + ' ' + active.variables.find((item) => item.id === input.dataset.variable).unit; })); result.style.display = 'none'; status.textContent = active.field.toUpperCase() + ' model ready. Change variables, then run the reasoning agents.'; } function effect(run) { const values = run.visualState.series || []; const bars = values.map((value, index) => '<span style="display:inline-block;width:3.2%;min-width:4px;height:' + Math.max(8, Math.round(value * 100)) + 'px;margin-right:1px;border-radius:4px 4px 1px 1px;background:' + (run.visualState.kind === 'climate' ? '#fb923c' : run.visualState.kind === 'ecosystem' ? '#86efac' : run.visualState.kind === 'reaction' ? '#c4b5fd' : '#67e8f9') + ';vertical-align:bottom;transition:height .45s ease"></span>').join(''); const orbit = run.visualState.trajectory ? '<svg viewBox="-1.4 -1.4 2.8 2.8" style="width:100%;height:160px;background:radial-gradient(circle,#13233c,#07111f);border-radius:12px"><circle cx="0" cy="0" r=".14" fill="#fef08a"/><path d="M ' + run.visualState.trajectory.map((point) => point.x.toFixed(2) + ' ' + point.y.toFixed(2)).join(' L ') + '" fill="none" stroke="#67e8f9" stroke-width=".025"/><circle cx="' + run.visualState.trajectory.at(-1).x.toFixed(2) + '" cy="' + run.visualState.trajectory.at(-1).y.toFixed(2) + '" r=".055" fill="#f8fafc"/></svg>' : '<div style="height:160px;padding:12px;display:flex;align-items:flex-end;background:linear-gradient(180deg,rgba(30,41,59,.8),rgba(2,6,23,.88));border-radius:12px">' + bars + '</div>'; return card('Live effect · ' + title(run.outcome), orbit + '<div style="margin-top:8px;color:#a5f3fc">' + run.visualState.causalChain.map(esc).join(' → ') + '</div>'); } async function run() { if (!active) return; status.textContent = 'Experiment API is running simulation, debate, math checks, and visual binding…'; result.style.display = 'none'; const vars = {}; controls.querySelectorAll('input[data-variable]').forEach((input) => vars[input.dataset.variable] = Number(input.value)); try { const response = await fetch('/api/experiments/' + encodeURIComponent(active.id) + '/run', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({variables:vars})}); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'run failed'); const h = data.cognitive.hypotheses.map((item) => '<div style="border-top:1px solid rgba(148,163,184,.16);padding:8px 0"><strong style="color:#fff">' + esc(item.label) + '</strong> <span style="float:right;color:' + (item.status === 'supported' ? '#86efac' : '#fde68a') + '">' + Math.round(item.score * 100) + '%</span><br><span style="color:#94a3b8">' + esc(item.reason) + '</span></div>').join(''); const checks = data.cognitive.mathChecks.map((item) => '<div style="margin:6px 0"><span style="color:' + (item.status === 'pass' ? '#86efac' : '#fde68a') + '">' + (item.status === 'pass' ? '✓' : '⚠') + '</span> <strong>' + esc(item.name) + '</strong>: ' + esc(item.result) + '</div>').join(''); result.innerHTML = '<div style="display:grid;gap:10px">' + effect(data.run) + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px">' + card('Hypothesis Arena', h) + card('Math AI checks', checks) + '</div>' + card('Judge synthesis', '<strong style="color:#fff">' + esc(data.cognitive.synthesis.conclusion) + '</strong><br>Confidence: ' + Math.round(data.cognitive.synthesis.confidence * 100) + '%<br><span style="color:#fde68a">Boundary: ' + esc(data.cognitive.synthesis.preservedDisagreement.join(' ')) + '</span>') + card('Next experiment', '<strong style="color:#fff">' + esc(data.cognitive.optimizer.recommendation) + '</strong><br>' + esc(data.cognitive.optimizer.reason)) + '</div>'; result.style.display = 'block'; status.textContent = 'Run complete. The chart and outcome above are generated from the current variable values.'; } catch { status.textContent = 'Experiment API unavailable. Existing Mini Experiment Lab controls remain available.'; } } select.addEventListener('change', showDefinition); runButton.addEventListener('click', run); fetch('/api/experiments').then((response) => response.json()).then((data) => { experiments = data.experiments || []; select.innerHTML = experiments.map((item) => '<option value="' + esc(item.id) + '">' + esc(item.field.toUpperCase() + ' · ' + item.title) + '</option>').join(''); showDefinition(); }).catch(() => status.textContent = 'Experiment catalog could not load.'); })();</script>
</section>`;
}

export async function GET(request: NextRequest) {
  const filePath = path.join(process.cwd(), MAIN_HTML_FILE);
  const html = await readFile(filePath, "utf8");
  const configScript = `<script>window.SCILOOP_SHARE_CONFIG=${JSON.stringify(buildShareConfig(request))};</script><script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};</script><script defer src="/_vercel/insights/script.js"></script><script>(()=>{const send=(payload)=>{try{const body=JSON.stringify({...payload,page:location.href});if(navigator.sendBeacon){navigator.sendBeacon('/api/client-error',new Blob([body],{type:'application/json'}));}else{fetch('/api/client-error',{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true});}}catch{}};window.addEventListener('error',(event)=>send({message:event.message,sourceFile:event.filename,line:event.lineno}));window.addEventListener('unhandledrejection',(event)=>send({message:String(event.reason||'Unhandled promise rejection')}));})();</script>`;
  const fallbackExperimentLab = buildExperimentLabBridge();
  const enhancedHtml = html.includes('id="sciloopExperimentLab"')
    ? html
    : html.replace(/<body[^>]*>/i, (match) => `${match}${fallbackExperimentLab}`);
  const withConfig = enhancedHtml.includes("</head>")
    ? enhancedHtml.replace("</head>", `${configScript}</head>`)
    : `${configScript}${enhancedHtml}`;

  return new NextResponse(withConfig, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
