export interface InnovationSignalInput {
  title?: string;
  summary?: string;
  source?: string;
  url?: string;
  subject?: string;
  publishedAt?: string;
  category?: string;
}

export interface InnovationEvaluation {
  overallScore: number;
  evidenceQuality: number;
  mechanismClarity: number;
  noveltySignal: number;
  impactPotential: number;
  uncertainty: number;
  asiRelevance: number;
  maturity: "signal" | "validated direction" | "prototype" | "deployment" | "unknown";
  strengths: string[];
  cautions: string[];
  nextAction: "read-source" | "visualize-mechanism" | "run-experiment" | "compare-alternatives" | "watch";
  disclaimer: string;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hostFromUrl(url = "") {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown-source";
  }
}

export function evaluateInnovationSignal(article: InnovationSignalInput): InnovationEvaluation {
  const text = `${article.title ?? ""} ${article.summary ?? ""}`.toLowerCase();
  const host = hostFromUrl(article.url);
  const isDemo = host.includes("example.com") || (article.source ?? "").toLowerCase().includes("local demo");
  const primarySource = ["nasa.gov", "openai.com", "nature.com", "science.org", "arxiv.org", "nih.gov", "ieee.org"].some((domain) => host.endsWith(domain));
  const hasMechanism = /because|how|method|mechanism|system|algorithm|material|process|model|technology/.test(text);
  const hasImpact = /impact|could|may help|enabl|improv|reduce|increase|climate|health|energy|society|useful/.test(text);
  const deploymentSignal = /deployed|launched|in use|clinical|approved|production|mission|field test/.test(text);
  const uncertaintySignal = /may|could|potential|early|preliminary|unknown|tbd|speculative|researchers hope/.test(text);
  const maturity = deploymentSignal ? "deployment" : /prototype|demonstrat|experiment|test/.test(text) ? "prototype" : primarySource && hasMechanism ? "validated direction" : isDemo ? "unknown" : "signal";
  const evidenceQuality = clamp((primarySource ? 72 : 48) + (article.url ? 10 : -15) + (article.publishedAt ? 8 : 0) - (isDemo ? 45 : 0));
  const mechanismClarity = clamp((hasMechanism ? 68 : 38) + (article.summary && article.summary.length > 160 ? 12 : 0));
  const noveltySignal = clamp(52 + (article.category === "Innovation" ? 18 : 0) + (/new|novel|first|breakthrough|discover/.test(text) ? 15 : 0));
  const impactPotential = clamp((hasImpact ? 64 : 42) + (/energy|health|climate|ai|space|materials|robot/.test(text) ? 12 : 0));
  const uncertainty = clamp((uncertaintySignal ? 68 : 34) + (isDemo ? 24 : 0) - (primarySource ? 8 : 0));
  const asiRelevance = clamp(28 + (/ai|intelligence|robot|compute|information|learning|autonom/.test(text) ? 34 : 0) + (hasMechanism ? 12 : 0) + (impactPotential > 70 ? 10 : 0));
  const overallScore = clamp(evidenceQuality * 0.28 + mechanismClarity * 0.2 + noveltySignal * 0.15 + impactPotential * 0.2 + (100 - uncertainty) * 0.17);
  const strengths = [
    primarySource ? "Source appears to be a recognized primary or technical publisher." : "A source link is present, but source quality still needs verification.",
    hasMechanism ? "The summary contains a mechanism or system clue that can be visualized." : "The mechanism is not yet clear from the available summary.",
    hasImpact ? "The signal includes a plausible real-world consequence." : "Impact is not established in the available text.",
  ];
  const cautions = [
    ...(isDemo ? ["This is a local demo item, not a verified live innovation signal."] : []),
    ...(uncertaintySignal ? ["Language indicates uncertainty; do not treat possibility as demonstrated outcome."] : []),
    ...(evidenceQuality < 60 ? ["Read the original source before making a strong claim."] : []),
  ];
  const nextAction = evidenceQuality < 60 ? "read-source" : !hasMechanism ? "visualize-mechanism" : impactPotential > 72 ? "compare-alternatives" : "run-experiment";
  return {
    overallScore,
    evidenceQuality,
    mechanismClarity,
    noveltySignal,
    impactPotential,
    uncertainty,
    asiRelevance,
    maturity,
    strengths,
    cautions,
    nextAction,
    disclaimer: "Future Lens is a triage aid, not a scientific peer-review score or a prediction of AGI impact.",
  };
}
