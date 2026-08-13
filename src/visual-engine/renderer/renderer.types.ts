import type {
  VisualRecipe,
  VisualRecipeLayer,
  VisualRecipeObject,
  VisualRecipeRelation,
} from "@/src/visual-engine/foundation";
import type { VisualFeedbackLoop, VisualFlow, VisualTransformation } from "@/src/visual-engine/foundation";

export type RendererMode = "compact" | "full";

export interface RendererValidationState {
  ok: boolean;
  errors: string[];
}

export interface VisualRecipeRendererProps {
  recipe: VisualRecipe;
  mode?: RendererMode;
}

export interface LayerRendererProps {
  layer: VisualRecipeLayer;
  objects: VisualRecipeObject[];
}

export interface NodeRendererProps {
  object: VisualRecipeObject;
}

export interface EdgeRendererProps {
  relation: VisualRecipeRelation;
  from?: VisualRecipeObject;
  to?: VisualRecipeObject;
}

export interface FlowRendererProps {
  flow: VisualFlow;
  source?: VisualRecipeObject;
  target?: VisualRecipeObject;
}

export interface TransformationRendererProps {
  transformation: VisualTransformation;
  getObjectLabel: (id: string) => string;
}

export interface TimelineRendererProps {
  recipe: VisualRecipe;
}

export interface FeedbackLoopRendererProps {
  feedbackLoop: VisualFeedbackLoop;
  getObjectLabel: (id: string) => string;
}

export interface ExplanationPanelProps {
  recipe: VisualRecipe;
}

export interface RendererFallbackProps {
  recipe?: Partial<VisualRecipe>;
  errors: string[];
}

