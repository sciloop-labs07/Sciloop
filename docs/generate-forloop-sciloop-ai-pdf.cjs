const fs = require("fs");
const path = require("path");

let PDFDocument;
try {
  PDFDocument = require("pdfkit");
} catch {
  PDFDocument = require(path.join(process.env.TEMP || process.env.TMP, "sciloop-pdf-tool", "node_modules", "pdfkit"));
}

const outPath = path.join(__dirname, "ForLoop_SciLoop_AI_Panel_Demo.pdf");
const doc = new PDFDocument({
  size: "A4",
  margin: 42,
  autoFirstPage: false,
  info: {
    Title: "ForLoop Control Panel - SciLoop AI Panel Demo",
    Author: "SciLoop",
    Subject: "Simple demo explanation of ForLoop SciLoop AI panel architecture",
  },
});

doc.pipe(fs.createWriteStream(outPath));

const W = 595.28;
const H = 841.89;
const M = 42;
const colors = {
  bg: "#071018",
  panel: "#0d1b2a",
  panel2: "#102235",
  cyan: "#00FFE1",
  blue: "#6DDCFF",
  gold: "#FFD36D",
  pink: "#FF6BD6",
  white: "#F2FBFF",
  muted: "#B8CADD",
  dim: "#7890A8",
  grid: "#12334A",
};

function pageBackground(pageNo, label) {
  doc.rect(0, 0, W, H).fill(colors.bg);
  doc.save();
  doc.opacity(0.2);
  for (let x = 0; x < W; x += 28) {
    doc.moveTo(x, 0).lineTo(x, H).stroke(colors.grid);
  }
  for (let y = 0; y < H; y += 28) {
    doc.moveTo(0, y).lineTo(W, y).stroke(colors.grid);
  }
  doc.opacity(1).restore();
  doc.circle(78, 82, 120).fillOpacity(0.12).fill(colors.cyan).fillOpacity(1);
  doc.circle(W - 72, 96, 95).fillOpacity(0.1).fill(colors.gold).fillOpacity(1);
  // Keep footer safely inside the printable margin so PDFKit does not auto-add pages.
  doc.font("Helvetica").fontSize(8).fillColor(colors.dim).text("SciLoop / ForLoop demo document", M, H - 70, {
    width: 220,
    lineBreak: false,
  });
  doc.text(`Page ${pageNo}`, W - 82, H - 70, {
    width: 40,
    lineBreak: false,
  });
  if (label) {
    doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.cyan).text(label.toUpperCase(), M, M - 18, {
      characterSpacing: 1.5,
    });
  }
}

function addPage(pageNo, label) {
  doc.addPage();
  pageBackground(pageNo, label);
}

function title(text, y = M) {
  doc.font("Helvetica-Bold").fontSize(30).fillColor(colors.white).text(text, M, y, {
    width: W - M * 2,
    lineGap: 2,
  });
  return doc.y + 12;
}

function h2(text, y = doc.y) {
  doc.font("Helvetica-Bold").fontSize(18).fillColor(colors.blue).text(text, M, y, {
    width: W - M * 2,
  });
  return doc.y + 10;
}

function h3(text, x, y, width) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.gold).text(text, x, y, { width });
  return doc.y + 4;
}

function para(text, x = M, y = doc.y, width = W - M * 2, size = 11) {
  doc.font("Helvetica").fontSize(size).fillColor(colors.muted).text(text, x, y, { width, lineGap: 3 });
  return doc.y + 8;
}

function panel(x, y, w, h, opts = {}) {
  doc.roundedRect(x, y, w, h, opts.r || 16)
    .fillOpacity(opts.opacity || 0.88)
    .fill(opts.fill || colors.panel)
    .fillOpacity(1);
  doc.roundedRect(x, y, w, h, opts.r || 16)
    .lineWidth(0.8)
    .stroke(opts.stroke || "#24455F");
}

function bulletList(items, x, y, width, size = 10.2) {
  let cy = y;
  items.forEach((item) => {
    doc.circle(x + 4, cy + 6, 2).fill(colors.cyan);
    doc.font("Helvetica").fontSize(size).fillColor(colors.muted).text(item, x + 14, cy, {
      width: width - 14,
      lineGap: 2,
    });
    cy = doc.y + 5;
  });
  return cy;
}

function badge(text, x, y, width) {
  panel(x, y, width, 24, { r: 12, fill: "#092033", stroke: "#1E6C7A", opacity: 0.92 });
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.white).text(text, x, y + 7, {
    width,
    align: "center",
  });
}

function callout(text, y) {
  panel(M, y, W - M * 2, 54, { fill: "#092332", stroke: colors.cyan, r: 14 });
  doc.rect(M, y, 4, 54).fill(colors.cyan);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.white).text(text, M + 16, y + 13, {
    width: W - M * 2 - 28,
    lineGap: 3,
  });
}

function flowBox(text, sub, x, y, w, h, color = colors.cyan) {
  panel(x, y, w, h, { fill: "#081A2A", stroke: color, r: 14, opacity: 0.94 });
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(colors.white).text(text, x + 10, y + 12, { width: w - 20 });
  doc.font("Helvetica").fontSize(8.3).fillColor(colors.muted).text(sub, x + 10, y + 34, {
    width: w - 20,
    lineGap: 2,
  });
}

function arrow(x1, y1, x2, y2, color = colors.cyan) {
  doc.moveTo(x1, y1).lineTo(x2, y2).strokeColor(color).lineWidth(1.6).stroke();
  doc.polygon([x2, y2], [x2 - 6, y2 - 4], [x2 - 6, y2 + 4]).fill(color);
}

function miniCard(titleText, body, x, y, w, h) {
  panel(x, y, w, h, { fill: colors.panel, stroke: "#24455F", r: 15 });
  h3(titleText, x + 13, y + 12, w - 26);
  doc.font("Helvetica").fontSize(9.4).fillColor(colors.muted).text(body, x + 13, doc.y, {
    width: w - 26,
    lineGap: 2,
  });
}

// Page 1
addPage(1, "Demo explanation");
let y = title("ForLoop Control Panel\nSciLoop AI Panel", 58);
doc.font("Helvetica").fontSize(13).fillColor(colors.muted).text(
  "A clear, simple explanation of how the SciLoop AI panel was developed, how it connects to SciLoop AI, and which backend APIs power the experience.",
  M,
  y,
  { width: 470, lineGap: 4 }
);
y = doc.y + 20;
["Control Panel", "Secure Backend APIs", "AI Explanation", "News to Visual Plan", "Provider Switching"].forEach((b, i) => {
  badge(b, M + i * 96, y, 88);
});
y += 48;
panel(M, y, W - M * 2, 238, { fill: "#081624", stroke: "#24536A", r: 20 });
doc.font("Helvetica-Bold").fontSize(19).fillColor(colors.blue).text("What We Created", M + 18, y + 18);
bulletList([
  "A SciLoop AI panel inside the ForLoop Control Panel.",
  "A backend-safe place to check AI server status, readiness, and provider keys.",
  "A control layer that connects SciLoop News Portal, AI explanation, simulation, and Visual Language Lab.",
  "A secure route where API keys stay server-side instead of being exposed in the browser.",
  "A demo-ready dashboard that makes the AI system visible and controllable."
], M + 20, y + 58, 332);
panel(W - M - 154, y + 20, 136, 56, { fill: "#102236", stroke: colors.cyan, r: 14 });
doc.font("Helvetica-Bold").fontSize(25).fillColor(colors.white).text("3001", W - M - 134, y + 31);
doc.font("Helvetica").fontSize(8.5).fillColor(colors.muted).text("ForLoop Control API", W - M - 134, y + 58);
panel(W - M - 154, y + 88, 136, 56, { fill: "#102236", stroke: colors.gold, r: 14 });
doc.font("Helvetica-Bold").fontSize(25).fillColor(colors.white).text("5050", W - M - 134, y + 99);
doc.font("Helvetica").fontSize(8.5).fillColor(colors.muted).text("SciLoop AI Backend", W - M - 134, y + 126);
panel(W - M - 154, y + 156, 136, 56, { fill: "#102236", stroke: colors.pink, r: 14 });
doc.font("Helvetica-Bold").fontSize(22).fillColor(colors.white).text("Secure", W - M - 134, y + 169);
doc.font("Helvetica").fontSize(8.5).fillColor(colors.muted).text("Keys stay backend-side", W - M - 134, y + 194);
callout("Demo line: I built the SciLoop AI control layer that connects the frontend, ForLoop dashboard, backend, provider APIs, and visual explanation system.", y + 260);

// Page 2
addPage(2, "Architecture");
y = h2("How the SciLoop AI Panel Connects Everything", 62);
para("The panel works like an operator dashboard. SciLoop is the user-facing product, ForLoop is the control layer, and sciloop-backend is the secure AI service.", M, y, W - M * 2, 11);
y = 142;
const fw = 92;
const fy = y;
flowBox("1. SciLoop UI", "User clicks Explain, Simulate, or Visualize.", M, fy, fw, 94);
flowBox("2. Proxy", "Routes request safely from app to backend.", M + 104, fy, fw, 94, colors.blue);
flowBox("3. AI Backend", "Builds prompt, cache, quota, fallback.", M + 208, fy, fw, 94, colors.gold);
flowBox("4. Provider Router", "Chooses Gemini, Groq, OpenRouter, etc.", M + 312, fy, fw, 94, colors.pink);
flowBox("5. SciLoop Result", "Renders explanation, timeline, visual plan.", M + 416, fy, fw, 94, colors.cyan);
for (let i = 0; i < 4; i++) arrow(M + 92 + i * 104, fy + 47, M + 104 + i * 104, fy + 47);
y = 268;
miniCard("ForLoop Control Panel Role", "Shows SciLoop AI status, saves/checks provider keys, starts the allowlisted backend target, and logs admin actions for demo visibility.", M, y, 242, 126);
miniCard("SciLoop AI Backend Role", "Receives article/concept data, builds prompts, calls providers server-side, handles fallback, and returns clean JSON to the UI.", M + 260, y, 242, 126);
callout("Important: API keys are not placed inside the HTML page. The browser talks to the backend; the backend talks to AI providers.", y + 152);

// Page 3
addPage(3, "APIs used");
y = h2("Main APIs Behind the SciLoop AI Panel", 62);
para("These are the important routes used by the control panel and the SciLoop AI experience.", M, y, W - M * 2, 11);
y = 122;
const rows = [
  ["GET /api/admin/sciloop-ai/status", "Checks backend/provider visibility for the ForLoop panel."],
  ["GET /api/admin/sciloop-ai/readiness", "Shows if enough provider keys are ready for a live demo."],
  ["POST /api/admin/sciloop-ai/keys", "Saves provider keys locally in backend env files."],
  ["POST /api/admin/sciloop-ai/check-provider", "Tests one provider and returns ready, missing key, quota, or warning."],
  ["POST /api/admin/sciloop-ai/check-all", "Runs full provider readiness check."],
  ["POST /api/admin/sciloop-ai/start-server", "Starts the SciLoop AI backend target safely."],
  ["POST /api/sciloop-ai/explain", "Turns news into simple meaning, timeline, people/team info, impact, and visual blueprint."],
  ["POST /api/sciloop-ai/simulate", "Creates a possibility simulation storyline."],
  ["POST /api/sciloop-ai/news-visualize", "Creates visual-plan handoff for Visual Language Lab."],
  ["GET /api/sciloop-ai/news-visualize/:handoffId", "Loads the stored visual-plan handoff after redirect."]
];
panel(M, y, W - M * 2, 392, { fill: "#081624", stroke: "#24536A", r: 18 });
let ty = y + 16;
rows.forEach(([route, why], i) => {
  const rowY = ty + i * 35;
  doc.font("Helvetica-Bold").fontSize(9.2).fillColor(i < 6 ? colors.cyan : colors.gold).text(route, M + 16, rowY, { width: 210 });
  doc.font("Helvetica").fontSize(9.2).fillColor(colors.muted).text(why, M + 242, rowY, { width: 270, lineGap: 2 });
  if (i < rows.length - 1) doc.moveTo(M + 14, rowY + 25).lineTo(W - M - 14, rowY + 25).strokeColor("#1A3448").lineWidth(0.6).stroke();
});
y += 414;
miniCard("Provider APIs Used", "Gemini for structured explanation and planning. Groq for fast responses. OpenRouter, Hugging Face, Together and others as optional routes. Local fallback keeps demos alive.", M, y, 502, 88);

// Page 4
addPage(4, "Explain flow");
y = h2("What Happens When a User Clicks Explain", 62);
const steps = [
  ["1", "User Action", "User opens News Portal and clicks Explain with SciLoop AI."],
  ["2", "Payload", "Frontend sends title, summary, source, URL, and date."],
  ["3", "Prompt", "Backend builds a structured prompt for simple explanation."],
  ["4", "Provider", "Provider router uses available APIs and switches if one fails."],
  ["5", "JSON", "Backend returns explanation, timeline, people/team info, impact, and blueprint."],
  ["6", "Live UI", "SciLoop shows colorful explanation with typing effect and simulation action."]
];
let sx = M;
let sy = 122;
steps.forEach((s, i) => {
  const x = sx + (i % 3) * 172;
  const y0 = sy + Math.floor(i / 3) * 142;
  panel(x, y0, 156, 116, { fill: "#081A2A", stroke: i % 2 ? colors.gold : colors.cyan, r: 18 });
  doc.circle(x + 21, y0 + 23, 14).fill(i % 2 ? colors.gold : colors.cyan);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(colors.bg).text(s[0], x + 17, y0 + 15);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.white).text(s[1], x + 42, y0 + 16, { width: 100 });
  doc.font("Helvetica").fontSize(8.8).fillColor(colors.muted).text(s[2], x + 16, y0 + 50, { width: 124, lineGap: 2 });
});
y = 426;
miniCard("What the User Sees", "Simple meaning, why it matters, people/team if confirmed, animated timeline, visual blueprint, and Simulate button.", M, y, 242, 112);
miniCard("What the Backend Handles", "Prompt construction, provider selection, quota/cache protection, error handling, and fallback explanation.", M + 260, y, 242, 112);
callout("Demo sentence: One click sends the article through a secure backend, talks to an AI provider, and returns a student-friendly SciLoop explanation.", y + 136);

// Page 5
addPage(5, "Security + reliability");
y = h2("Why This Architecture Is Safe and Demo-Ready", 62);
const safety = [
  ["Keys stay hidden", "Provider keys are read from backend environment files. The browser never receives real API keys."],
  ["Controlled panel", "ForLoop admin actions use an access code and allowlisted runtime targets."],
  ["Failure-safe UI", "If a provider fails, hits quota, or times out, SciLoop can switch provider or use local fallback."],
  ["Quota protection", "Cache, cooldowns, and provider status checks protect limits during demos."],
  ["Clean JSON", "The UI receives predictable fields for explanation, timeline, simulation, and visual plans."],
  ["Expandable", "The same pattern can support more providers, subjects, voice, visuals, and future learning tools."]
];
safety.forEach((s, i) => {
  const x = M + (i % 2) * 260;
  const y0 = 118 + Math.floor(i / 2) * 104;
  miniCard(s[0], s[1], x, y0, 242, 82);
});
y = 450;
panel(M, y, W - M * 2, 148, { fill: "#081624", stroke: colors.cyan, r: 18 });
doc.font("Helvetica-Bold").fontSize(18).fillColor(colors.blue).text("How to Explain: I Created SciLoop AI", M + 16, y + 16);
bulletList([
  "I created the SciLoop AI experience layer: explanation panel, timeline, simulation button, and visual handoff.",
  "I connected the frontend to a secure backend instead of exposing API keys.",
  "I built the ForLoop SciLoop AI panel for readiness, provider checks, backend status, and runtime start.",
  "I connected News Portal to AI explanation and Visual Language Lab."
], M + 18, y + 52, W - M * 2 - 34, 9.7);

// Page 6
addPage(6, "Presentation script");
y = h2("Simple Demo Script", 62);
const scriptCards = [
  ["Opening", "This is the ForLoop Control Panel. I built a SciLoop AI panel inside it so I can check and control the AI layer of my SciLoop platform from one place."],
  ["Backend", "The AI keys are not inside the website. They stay in the backend. The frontend only sends safe requests, and the backend talks to providers."],
  ["News Portal", "When a user clicks Explain with SciLoop AI, the article title and summary go to my backend, and the backend returns structured learning content."],
  ["Visualize", "When the user clicks Visualize, SciLoop creates a visual plan and opens the Visual Language Lab so the idea becomes a causal visual scene."]
];
scriptCards.forEach((s, i) => {
  const x = M + (i % 2) * 260;
  const y0 = 118 + Math.floor(i / 2) * 134;
  miniCard(s[0], s[1], x, y0, 242, 108);
});
y = 410;
panel(M, y, W - M * 2, 104, { fill: "#071A29", stroke: colors.gold, r: 20 });
doc.font("Helvetica-Bold").fontSize(18).fillColor(colors.gold).text("Final One-Line Summary", M + 18, y + 18);
doc.font("Helvetica-Bold").fontSize(15).fillColor(colors.white).text(
  "ForLoop controls the AI system, SciLoop AI explains and simulates the news, and the Visual Language Lab turns that explanation into a visual learning scene.",
  M + 18,
  y + 48,
  { width: W - M * 2 - 36, lineGap: 3 }
);
callout("Best demo order: ForLoop Control Panel -> check SciLoop AI status -> open SciLoop News Portal -> Explain -> show live explanation -> Simulate or Visualize.", y + 132);

doc.end();

doc.on("end", () => {
  console.log(outPath);
});
