import { generateRealityEngine } from "../services/sciloop-analysis.service.js";

export async function handleRealityGenerate(req, res) {
  try {
    const body = req.body || {};
    const title = String(body.title || body.article?.title || "").trim();
    const summary = String(body.summary || body.article?.summary || body.description || "").trim();

    if (!title && !summary) {
      return res.status(400).json({
        ok: false,
        error: "title or summary is required"
      });
    }

    const result = await generateRealityEngine({
      title,
      summary,
      field: body.field || body.subject || body.article?.subject,
      fullText: body.fullText || body.text || body.article?.fullText || ""
    });

    return res.json(result);
  } catch (error) {
    console.error("[reality-engine] generate failed:", error);
    return res.status(500).json({
      ok: false,
      error: "Reality Engine generation failed",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
