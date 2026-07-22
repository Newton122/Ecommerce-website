-- AlterTable
ALTER TABLE "DesignRequest" ADD COLUMN     "designPosX" DOUBLE PRECISION,
ADD COLUMN     "designPosY" DOUBLE PRECISION,
ADD COLUMN     "designRotation" DOUBLE PRECISION,
ADD COLUMN     "designScale" DOUBLE PRECISION,
ADD COLUMN     "mockupVariant" INTEGER,
ALTER COLUMN "mockupImage" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DesignRequestNote" (
    "id" SERIAL NOT NULL,
    "designRequestId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignRequestNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DesignRequestNote_designRequestId_idx" ON "DesignRequestNote"("designRequestId");

-- AddForeignKey
ALTER TABLE "DesignRequestNote" ADD CONSTRAINT "DesignRequestNote_designRequestId_fkey" FOREIGN KEY ("designRequestId") REFERENCES "DesignRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

