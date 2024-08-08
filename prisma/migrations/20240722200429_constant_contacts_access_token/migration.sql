-- CreateTable
CREATE TABLE "CC_Token" (
    "cuid" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CC_Token_pkey" PRIMARY KEY ("cuid")
);
