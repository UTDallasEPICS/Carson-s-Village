/*
  Warnings:

  - You are about to drop the column `amount_distributed` on the `pages` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_of_birth" DATETIME,
    "day_of_passing" DATETIME,
    "visitation_date" DATETIME,
    "visitation_location" TEXT NOT NULL,
    "visitation_address" TEXT NOT NULL DEFAULT '',
    "visitation_description" TEXT NOT NULL,
    "funeral_date" DATETIME,
    "funeral_location" TEXT NOT NULL,
    "funeral_description" TEXT NOT NULL,
    "funeral_address" TEXT NOT NULL DEFAULT '',
    "obituary" TEXT NOT NULL,
    "donation_goal" INTEGER NOT NULL DEFAULT 0,
    "donation_description" TEXT NOT NULL DEFAULT '',
    "amount_raised" INTEGER NOT NULL DEFAULT 0,
    "deadline" DATETIME,
    "user_cuid" TEXT NOT NULL,
    "profile_image_cuid" TEXT NOT NULL,
    "family_cuid" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "donation_status" TEXT NOT NULL DEFAULT 'in progress',
    "duration" TEXT NOT NULL DEFAULT '0 days',
    "start_date" DATETIME NOT NULL,
    "goal_met_date" DATETIME,
    "page_first_name" TEXT NOT NULL DEFAULT '',
    "page_last_name" TEXT NOT NULL DEFAULT '',
    "last_donation_date" DATETIME,
    CONSTRAINT "pages_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pages_user_cuid_fkey" FOREIGN KEY ("user_cuid") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pages" ("amount_raised", "day_of_birth", "day_of_passing", "deadline", "donation_description", "donation_goal", "donation_status", "duration", "family_cuid", "funeral_address", "funeral_date", "funeral_description", "funeral_location", "goal_met_date", "id", "last_donation_date", "obituary", "page_first_name", "page_last_name", "profile_image_cuid", "start_date", "status", "user_cuid", "visitation_address", "visitation_date", "visitation_description", "visitation_location") SELECT "amount_raised", "day_of_birth", "day_of_passing", "deadline", "donation_description", "donation_goal", "donation_status", "duration", "family_cuid", "funeral_address", "funeral_date", "funeral_description", "funeral_location", "goal_met_date", "id", "last_donation_date", "obituary", "page_first_name", "page_last_name", "profile_image_cuid", "start_date", "status", "user_cuid", "visitation_address", "visitation_date", "visitation_description", "visitation_location" FROM "pages";
DROP TABLE "pages";
ALTER TABLE "new_pages" RENAME TO "pages";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
