-- AlterTable
ALTER TABLE "Family" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pages" ALTER COLUMN "last_donation_date" DROP NOT NULL,
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "goal_met_date" DROP NOT NULL;
