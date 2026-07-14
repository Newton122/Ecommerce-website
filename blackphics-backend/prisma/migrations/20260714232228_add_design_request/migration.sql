-- CreateTable
CREATE TABLE "DesignRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "userEmail" TEXT,
    "userName" TEXT,
    "shirtType" TEXT NOT NULL,
    "shirtColor" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "viewSide" TEXT,
    "designImage" TEXT NOT NULL,
    "mockupImage" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignRequest_pkey" PRIMARY KEY ("id")
);
