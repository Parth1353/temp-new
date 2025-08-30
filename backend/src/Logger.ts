// Logger.ts
import Log from './models/Log';

export async function addLog(
  action: 'REQUEST' | 'ALLOCATE' | 'ROLLBACK',
  patientName: string,
  details: string
) {
  try {
    await Log.create({ action, patientName, details });
  } catch (error) {
    console.error('Failed to create log:', error);
  }
}
