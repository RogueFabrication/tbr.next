export function toArray<T>(input: unknown): T[] {
  if (Array.isArray(input)) return input as T[];
  if (input && typeof input === "object" && Array.isArray((input as any).items)) {
    return (input as any).items as T[];
  }
  return [];
}
