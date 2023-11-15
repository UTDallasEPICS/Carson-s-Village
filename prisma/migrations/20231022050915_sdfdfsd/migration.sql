-- DropForeignKey
ALTER TABLE "connected_accounts" DROP CONSTRAINT "connected_accounts_familyCuid_fkey";

-- AlterTable
ALTER TABLE "connected_accounts" ALTER COLUMN "familyCuid" DROP NOT NULL,
ALTER COLUMN "familyCuid" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "connected_accounts" ADD CONSTRAINT "connected_accounts_familyCuid_fkey" FOREIGN KEY ("familyCuid") REFERENCES "Family"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
