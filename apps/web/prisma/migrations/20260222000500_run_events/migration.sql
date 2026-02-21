-- Add monotonic event cursor to runs
ALTER TABLE "TestRun"
  ADD COLUMN "eventSeq" INTEGER NOT NULL DEFAULT 0;

-- Append-only live event log for run replay/streaming
CREATE TABLE "RunEvent" (
  "id" UUID NOT NULL,
  "runId" UUID NOT NULL,
  "seq" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RunEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "RunEvent"
  ADD CONSTRAINT "RunEvent_runId_fkey"
  FOREIGN KEY ("runId") REFERENCES "TestRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "RunEvent_runId_seq_key" ON "RunEvent"("runId", "seq");
CREATE INDEX "RunEvent_runId_createdAt_idx" ON "RunEvent"("runId", "createdAt");
