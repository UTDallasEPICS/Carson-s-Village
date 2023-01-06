-- CreateTable
CREATE TABLE "user_accounts" (
    "cuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_role" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "page_details" (
    "cuid" TEXT NOT NULL,
    "page_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "day_of_birth" TIMESTAMP(3) NOT NULL,
    "day_of_passing" TIMESTAMP(3) NOT NULL,
    "visitation_date" TIMESTAMP(3) NOT NULL,
    "visitation_time" TIMESTAMP(3) NOT NULL,
    "visitation_location" TEXT NOT NULL,
    "visitation_description" TEXT NOT NULL,
    "funeral_date" TIMESTAMP(3) NOT NULL,
    "funeral_time" TIMESTAMP(3) NOT NULL,
    "funeral_location" TEXT NOT NULL,
    "funeral_description" TEXT NOT NULL,
    "obituary" TEXT NOT NULL,
    "images" TEXT[],
    "donation_goal" MONEY NOT NULL,
    "amount_raised" MONEY NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "family_cuid" TEXT NOT NULL,

    CONSTRAINT "page_details_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "page_donations" (
    "cuid" TEXT NOT NULL,
    "family_cuid" TEXT NOT NULL,
    "page_cuid" TEXT NOT NULL,
    "page_name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "page_donations_pkey" PRIMARY KEY ("cuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_email_key" ON "user_accounts"("email");

-- AddForeignKey
ALTER TABLE "page_details" ADD CONSTRAINT "page_details_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_donations" ADD CONSTRAINT "page_donations_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "page_details"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_donations" ADD CONSTRAINT "page_donations_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
