-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'family',
    "familyId" TEXT,
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" DATETIME,
    CONSTRAINT "user_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_user" ("address", "createdAt", "email", "emailVerified", "familyId", "id", "image", "name", "phone", "role", "updatedAt") SELECT "address", "createdAt", "email", "emailVerified", "familyId", "id", "image", "name", "phone", "role", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE TABLE "new_Family" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "family_name" TEXT NOT NULL,
    "stripe_account_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "advocate_cuid" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" DATETIME,
    CONSTRAINT "Family_advocate_cuid_fkey" FOREIGN KEY ("advocate_cuid") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Family" ("advocate_cuid", "created_at", "family_name", "id", "stripe_account_id", "updated_at") SELECT "advocate_cuid", "created_at", "family_name", "id", "stripe_account_id", "updated_at" FROM "Family";
DROP TABLE "Family";
ALTER TABLE "new_Family" RENAME TO "Family";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
