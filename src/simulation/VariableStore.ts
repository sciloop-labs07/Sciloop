import type { SemanticVariable } from "@/src/semantic/SemanticTypes";

export class VariableStore {
  private variables = new Map<string, SemanticVariable>();

  constructor(variables: SemanticVariable[] = []) {
    this.setAll(variables);
  }

  setAll(variables: SemanticVariable[]) {
    this.variables = new Map(variables.map((variable) => [variable.id, { ...variable }]));
  }

  get(id: string, fallback = 0) {
    return this.variables.get(id)?.value ?? fallback;
  }

  set(id: string, value: number) {
    const variable = this.variables.get(id);
    if (!variable) return;
    variable.value = Math.min(variable.max, Math.max(variable.min, value));
  }

  list() {
    return [...this.variables.values()];
  }
}
