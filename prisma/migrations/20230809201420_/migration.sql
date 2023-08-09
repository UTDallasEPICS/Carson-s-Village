-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_pageCuid_fkey";

-- DropIndex
DROP INDEX "images_pageCuid_url_key";

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "pageCuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_pageCuid_fkey" FOREIGN KEY ("pageCuid") REFERENCES "pages"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
