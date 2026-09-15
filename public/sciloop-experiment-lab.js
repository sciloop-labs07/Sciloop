(() => {
  const $ = (id) => document.getElementById(id);
  const select = $("sciloopExperimentSelect");
  const controls = $("sciloopExperimentControls");
  const quickPicks = $("sciloopExperimentQuickPicks");
  const status = $("sciloopExperimentStatus");
  const result = $("sciloopExperimentResult");
  const runButton = $("sciloopExperimentRun");
  if (!select || !controls || !quickPicks || !status || !result || !runButton) return;

  let experiments = [];
  let active = null;
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
  const title = (value) => String(value).replaceAll("-", " ");
  const card = (heading, body) => `<div style="padding:12px;border:1px solid rgba(165,243,252,.16);border-radius:15px;background:rgba(2,8,23,.28)"><div style="color:#67e8f9;text-transform:uppercase;letter-spacing:.14em;font-size:10px">${esc(heading)}</div><div style="margin-top:7px;color:#dbeafe;line-height:1.55">${body}</div></div>`;

  function setActive(id) {
    active = experiments.find((item) => item.id === id);
    if (!active) return;
    select.value = id;
    $("sciloopExperimentTitle").textContent = active.title;
    $("sciloopExperimentQuestion").textContent = active.question;
    quickPicks.querySelectorAll("button").forEach((button) => {
      button.style.background = button.dataset.id === id ? "#cffafe" : "rgba(34,211,238,.1)";
      button.style.color = button.dataset.id === id ? "#082f49" : "#bae6fd";
    });
    controls.innerHTML = active.variables.map((item) => `<label style="padding:10px;border-radius:12px;background:rgba(15,23,42,.38)">${esc(item.label)} <span id="sciloopValue-${esc(item.id)}" style="color:#fff">${esc(item.value)} ${esc(item.unit)}</span><small style="display:block;color:#94a3b8;margin-top:3px">${esc(item.description)}</small><input data-variable="${esc(item.id)}" type="range" min="${item.min}" max="${item.max}" step="${item.step}" value="${item.value}" style="display:block;width:100%;margin-top:8px"></label>`).join("");
    controls.querySelectorAll("input[data-variable]").forEach((input) => input.addEventListener("input", () => {
      const variable = active.variables.find((item) => item.id === input.dataset.variable);
      const output = $("sciloopValue-" + input.dataset.variable);
      if (output && variable) output.textContent = `${input.value} ${variable.unit}`;
    }));
    result.style.display = "none";
    status.textContent = `${active.field.toUpperCase()} model ready. Change one variable at a time, then test the conclusion.`;
  }

  function liveEffect(run) {
    const colors = { orbit: "#67e8f9", reaction: "#c4b5fd", ecosystem: "#86efac", climate: "#fb923c", circuit: "#facc15", epidemic: "#fb7185", learning: "#60a5fa", materials: "#fda4af" };
    const color = colors[run.visualState.kind] || "#67e8f9";
    const bars = (run.visualState.series || []).map((value) => `<span style="display:inline-block;width:3.2%;min-width:4px;height:${Math.max(8, Math.round(value * 100))}px;margin-right:1px;border-radius:4px 4px 1px 1px;background:${color};vertical-align:bottom;transition:height .45s ease"></span>`).join("");
    const orbit = run.visualState.trajectory ? `<svg viewBox="-1.4 -1.4 2.8 2.8" style="width:100%;height:160px;background:radial-gradient(circle,#13233c,#07111f);border-radius:12px"><circle cx="0" cy="0" r=".14" fill="#fef08a"/><path d="M ${run.visualState.trajectory.map((point) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" L ")}" fill="none" stroke="${color}" stroke-width=".025"/><circle cx="${run.visualState.trajectory.at(-1).x.toFixed(2)}" cy="${run.visualState.trajectory.at(-1).y.toFixed(2)}" r=".055" fill="#f8fafc"/></svg>` : `<div style="height:160px;padding:12px;display:flex;align-items:flex-end;background:linear-gradient(180deg,rgba(30,41,59,.8),rgba(2,6,23,.88));border-radius:12px">${bars}</div>`;
    return card(`Live effect · ${title(run.outcome)}`, `${orbit}<div style="margin-top:8px;color:#a5f3fc">${run.visualState.causalChain.map(esc).join(" → ")}</div>`);
  }

  async function run() {
    if (!active) return;
    status.textContent = "Experiment API is running simulation, debate, mathematical checks, and visual binding…";
    result.style.display = "none";
    const variables = {};
    controls.querySelectorAll("input[data-variable]").forEach((input) => { variables[input.dataset.variable] = Number(input.value); });
    try {
      const response = await fetch(`/api/experiments/${encodeURIComponent(active.id)}/run`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ variables }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "run failed");
      const hypotheses = data.cognitive.hypotheses.map((item) => `<div style="border-top:1px solid rgba(148,163,184,.16);padding:8px 0"><strong style="color:#fff">${esc(item.label)}</strong><span style="float:right;color:${item.status === "supported" ? "#86efac" : "#fde68a"}">${Math.round(item.score * 100)}%</span><br><span style="color:#94a3b8">${esc(item.reason)}</span></div>`).join("");
      const checks = data.cognitive.mathChecks.map((item) => `<div style="margin:6px 0"><span style="color:${item.status === "pass" ? "#86efac" : "#fde68a"}">${item.status === "pass" ? "✓" : "⚠"}</span> <strong>${esc(item.name)}</strong>: ${esc(item.result)}</div>`).join("");
      result.innerHTML = `<div style="display:grid;gap:10px">${liveEffect(data.run)}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px">${card("Hypothesis Arena", hypotheses)}${card("Math AI checks", checks)}</div>${card("Judge synthesis", `<strong style="color:#fff">${esc(data.cognitive.synthesis.conclusion)}</strong><br>Confidence: ${Math.round(data.cognitive.synthesis.confidence * 100)}%<br><span style="color:#fde68a">Boundary: ${esc(data.cognitive.synthesis.preservedDisagreement.join(" "))}</span>`)}${card("Next experiment", `<strong style="color:#fff">${esc(data.cognitive.optimizer.recommendation)}</strong><br>${esc(data.cognitive.optimizer.reason)}`)}</div>`;
      result.style.display = "block";
      status.textContent = "Run complete. The visual above is generated from your current variables.";
    } catch { status.textContent = "Experiment API unavailable. Existing Mini Experiment Lab controls remain available."; }
  }

  select.addEventListener("change", () => setActive(select.value));
  runButton.addEventListener("click", run);
  fetch("/api/experiments").then((response) => response.json()).then((data) => {
    experiments = data.experiments || [];
    select.innerHTML = experiments.map((item) => `<option value="${esc(item.id)}">${esc(item.field.toUpperCase() + " · " + item.title)}</option>`).join("");
    quickPicks.innerHTML = experiments.map((item) => `<button type="button" data-id="${esc(item.id)}" style="border:1px solid rgba(165,243,252,.18);border-radius:999px;background:rgba(34,211,238,.1);color:#bae6fd;padding:7px 10px;cursor:pointer">${esc(item.field)} · ${esc(item.title.split(":")[0])}</button>`).join("");
    quickPicks.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setActive(button.dataset.id)));
    setActive(experiments[0]?.id);
  }).catch(() => { status.textContent = "Experiment catalog could not load."; });
})();
