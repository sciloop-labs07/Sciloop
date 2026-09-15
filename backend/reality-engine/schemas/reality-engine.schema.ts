export interface RealityEngineInput {
  title: string;
  summary?: string;
  field?: string;
  fullText?: string;
}

export interface RealityCausalAnalysis {
  innovation_name: string;
  problem_space: string[];
  human_intention: string[];
  system_bottlenecks: string[];
  mechanism_of_change: string[];
  before_world: Record<string, unknown>;
  discovery_event: Record<string, unknown>;
  after_world: Record<string, unknown>;
  future_branches: Array<Record<string, unknown>>;
  civilization_impact: Record<string, unknown>;
  entropy_changes: Record<string, unknown>;
  scale_propagation: Record<string, unknown>;
}

export interface UnityScenePromptBundle {
  before_world_prompt: string;
  after_world_prompt: string;
  future_branch_prompts: string[];
  npc_behaviors: string[];
  timeline_events: Array<Record<string, unknown>>;
  environment_assets: string[];
  atmosphere_settings: Record<string, unknown>;
}

export interface RealityEngineResponse {
  ok: boolean;
  analysis: RealityCausalAnalysis;
  unity: UnityScenePromptBundle;
  timeline: Array<Record<string, unknown>>;
  causalGraph: Record<string, unknown>;
  entropyVisualization: Record<string, unknown>;
  scalePropagation: Record<string, unknown>;
  generatedAt: string;
}
