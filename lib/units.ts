// lib/units.ts
export function parseCapacityInches(input?: string | null): number {
  if (!input) return 0;
  const s = String(input).trim();

  // 2.375", 2.0", 2"
  const dec = s.match(/(\d+(?:\.\d+)?)(?=\s*["”]?)/);
  if (dec && !s.includes("-") && !s.includes("/")) {
    const n = Number(dec[1]);
    return Number.isFinite(n) ? n : 0;
  }

  // 2-3/8", 1-1/2"
  const mixed = s.match(/(\d+)\s*-\s*(\d+)\s*\/\s*(\d+)/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const num = Number(mixed[2]);
    const den = Number(mixed[3]);
    if (den) return whole + num / den;
  }

  // 1 1/2"
  const spaced = s.match(/(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (spaced) {
    const whole = Number(spaced[1]);
    const num = Number(spaced[2]);
    const den = Number(spaced[3]);
    if (den) return whole + num / den;
  }

  const anyNum = s.match(/(\d+(?:\.\d+)?)/);
  if (anyNum) {
    const n = Number(anyNum[1]);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}
