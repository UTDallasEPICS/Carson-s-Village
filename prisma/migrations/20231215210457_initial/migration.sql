-- CreateTable
CREATE TABLE "user_accounts" (
    "cuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_role" TEXT NOT NULL DEFAULT 'family',
    "first_name" TEXT NOT NULL DEFAULT '',
    "middle_name" TEXT NOT NULL DEFAULT '',
    "last_name" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "familyCuid" TEXT,

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "Family" (
    "cuid" TEXT NOT NULL,
    "family_name" TEXT NOT NULL,
    "stripe_account_id" TEXT,
    "created_at" TEXT NOT NULL DEFAULT '',
    "updated_at" TEXT NOT NULL DEFAULT '',
    "advocate_cuid" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "DonationPayout" (
    "cuid" TEXT NOT NULL,
    "familly_cuid" TEXT NOT NULL,
    "page_cuid" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "distributionDate" TEXT NOT NULL,

    CONSTRAINT "DonationPayout_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "pages" (
    "cuid" TEXT NOT NULL,
    "page_name" TEXT NOT NULL,
    "day_of_birth" TEXT,
    "day_of_passing" TEXT,
    "visitation_date" TEXT,
    "visitation_location" TEXT NOT NULL,
    "visitation_description" TEXT NOT NULL,
    "funeral_date" TEXT,
    "funeral_location" TEXT NOT NULL,
    "funeral_description" TEXT NOT NULL,
    "obituary" TEXT NOT NULL,
    "donation_goal" INTEGER NOT NULL DEFAULT 0,
    "amount_raised" INTEGER NOT NULL DEFAULT 0,
    "deadline" TEXT NOT NULL,
    "user_cuid" TEXT NOT NULL,
    "amount_distributed" INTEGER NOT NULL DEFAULT 0,
    "profile_image_cuid" TEXT NOT NULL,
    "family_cuid" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "donation_status" TEXT NOT NULL DEFAULT 'in progress',
    "duration" TEXT NOT NULL DEFAULT '0 days',
    "start_date" TEXT NOT NULL DEFAULT '',
    "goal_met_date" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "pages_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "page_donations" (
    "cuid" TEXT NOT NULL,
    "family_cuid" TEXT NOT NULL,
    "page_cuid" TEXT NOT NULL,
    "donorFirstName" TEXT NOT NULL DEFAULT '',
    "donorLastName" TEXT NOT NULL DEFAULT '',
    "comments" TEXT NOT NULL DEFAULT '',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "transaction_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "page_donations_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "Reply" (
    "cuid" TEXT NOT NULL,
    "page_cuid" TEXT NOT NULL,
    "family_cuid" TEXT NOT NULL,
    "reply" TEXT NOT NULL DEFAULT '',
    "name" TEXT DEFAULT '',

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "images" (
    "cuid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pageCuid" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("cuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_email_key" ON "user_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DonationPayout_transaction_id_key" ON "DonationPayout"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "page_donations_transaction_id_key" ON "page_donations"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "images_pageCuid_url_key" ON "images"("pageCuid", "url");

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_familyCuid_fkey" FOREIGN KEY ("familyCuid") REFERENCES "Family"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_advocate_cuid_fkey" FOREIGN KEY ("advocate_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationPayout" ADD CONSTRAINT "DonationPayout_familly_cuid_fkey" FOREIGN KEY ("familly_cuid") REFERENCES "Family"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationPayout" ADD CONSTRAINT "DonationPayout_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "pages"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_user_cuid_fkey" FOREIGN KEY ("user_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_donations" ADD CONSTRAINT "page_donations_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_donations" ADD CONSTRAINT "page_donations_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "pages"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "pages"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_pageCuid_fkey" FOREIGN KEY ("pageCuid") REFERENCES "pages"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
