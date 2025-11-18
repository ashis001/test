-- Prisma migration for initial Link table
CREATE TABLE IF NOT EXISTS "Link" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "url" TEXT NOT NULL,
  "clicks" INTEGER NOT NULL DEFAULT 0,
  "lastClickedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Link_code_idx" ON "Link" ("code");
