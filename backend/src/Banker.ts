// Banker.ts
// Banker's Algorithm for safe ICU bed allocation

export function isSafeState(
  currentAlloc: number,
  request: number,
  available: number
): boolean {
  // TODO: Implement real Banker's Algorithm logic
  // Placeholder: allow if request <= available
  return request <= available;
}
