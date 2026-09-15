export type ResearchSourceType = "textbook" | "primary-paper" | "institution" | "measurement" | "review";

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  publisher: string;
  sourceType: ResearchSourceType;
  accessedAt: string;
  claims: string[];
  limitations: string[];
}

export function validateResearchSource(source: ResearchSource): string[] {
  const errors: string[] = [];
  const sourceTypes: ResearchSourceType[] = ["textbook", "primary-paper", "institution", "measurement", "review"];
  try {
    const url = new URL(source.url);
    if (!['http:', 'https:'].includes(url.protocol)) errors.push('Research source URL must use HTTP(S).');
  } catch {
    errors.push('Research source URL must be explicit and valid.');
  }
  if (!source.id?.trim()) errors.push('Research source is missing id.');
  if (!source.title?.trim()) errors.push('Research source is missing title.');
  if (!source.publisher?.trim()) errors.push('Research source is missing publisher.');
  if (!sourceTypes.includes(source.sourceType)) errors.push('Research source type is invalid.');
  if (!source.accessedAt?.trim()) errors.push('Research source is missing accessedAt.');
  if (!Array.isArray(source.claims) || source.claims.length === 0 || source.claims.some((claim) => !claim.trim())) {
    errors.push('Research source must contain non-empty claims.');
  }
  if (!Array.isArray(source.limitations) || source.limitations.length === 0 || source.limitations.some((item) => !item.trim())) {
    errors.push('Research source must contain limitations.');
  }
  return errors;
}
