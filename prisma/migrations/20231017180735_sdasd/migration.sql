/*
  Warnings:

  - Added the required column `families_cuid` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "families_cuid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "connected_accounts" (
    "cuid" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "country_of_residence" TEXT NOT NULL,

    CONSTRAINT "connected_accounts_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "Family" (
    "cuid" TEXT NOT NULL,
    "Stripe_Account_id" TEXT,
    "Stripe_Accont_cuid" TEXT,
    "family_member_cuids" TEXT[],
    "family_relationship" TEXT NOT NULL,
    "family_role" TEXT NOT NULL,
    "created_at" TEXT NOT NULL DEFAULT '',
    "updated_at" TEXT NOT NULL,
    "advocate_cuid" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("cuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Family_advocate_cuid_key" ON "Family"("advocate_cuid");

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_advocate_cuid_fkey" FOREIGN KEY ("advocate_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_families_cuid_fkey" FOREIGN KEY ("families_cuid") REFERENCES "Family"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
