let nextId = 0;

export function createId(prefix = "id") {
  nextId += 1;
  return `${prefix}-${nextId.toString(36)}`;
}
