export type RunEventEnvelope = {
  runId: string
  seq: number
  at: string
  type: string
  payload: Record<string, unknown>
}
