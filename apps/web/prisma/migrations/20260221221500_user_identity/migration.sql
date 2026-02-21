-- AlterTable
ALTER TABLE "User"
ADD COLUMN "supabaseAuthId" TEXT,
ADD COLUMN "lastSeenAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseAuthId_key" ON "User"("supabaseAuthId");
