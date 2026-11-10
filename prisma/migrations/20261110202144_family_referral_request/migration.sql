-- CreateTable
CREATE TABLE "family_referral_request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inviteeName" TEXT NOT NULL,
    "inviteeEmail" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requesterId" TEXT NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "family_referral_request_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "family_referral_request_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "family_referral_request_inviteeEmail_key" ON "family_referral_request"("inviteeEmail");
