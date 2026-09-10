CREATE TABLE IF NOT EXISTS reality_engine_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_title TEXT NOT NULL,
  article_summary TEXT,
  field TEXT,
  source_url TEXT,
  causal_analysis JSONB NOT NULL,
  unity_prompt_bundle JSONB NOT NULL,
  timeline JSONB NOT NULL,
  causal_graph JSONB NOT NULL,
  entropy_visualization JSONB NOT NULL,
  scale_propagation JSONB NOT NULL,
  engine_version TEXT NOT NULL DEFAULT '0.1.0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reality_engine_runs_field_idx
  ON reality_engine_runs (field);

CREATE INDEX IF NOT EXISTS reality_engine_runs_created_at_idx
  ON reality_engine_runs (created_at DESC);
