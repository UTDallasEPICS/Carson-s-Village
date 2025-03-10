-- DropForeignKey
ALTER TABLE "Family" DROP CONSTRAINT "Family_advocate_cuid_fkey";

-- AlterTable
ALTER TABLE "Family" ALTER COLUMN "advocate_cuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_advocate_cuid_fkey" FOREIGN KEY ("advocate_cuid") REFERENCES "user_accounts"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
