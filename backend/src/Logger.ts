// Logger.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import Log from "./models/Log.js";

export async function addLog(
  action: "REQUEST" | "ALLOCATE" | "ROLLBACK",
  patientName: string,
  details: string
) {
  // TODO: Add error handling, transaction support
  await (Log as any).create({ action, patientName, details });
}
