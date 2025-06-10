/*
  Warnings:

  - You are about to drop the `Capacity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ToolCapacity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Capacity" DROP CONSTRAINT "Capacity_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "ToolCapacity" DROP CONSTRAINT "ToolCapacity_capacityId_fkey";

-- DropForeignKey
ALTER TABLE "ToolCapacity" DROP CONSTRAINT "ToolCapacity_toolId_fkey";

-- DropTable
DROP TABLE "Capacity";

-- DropTable
DROP TABLE "ToolCapacity";

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolColors" (
    "id" TEXT NOT NULL,
    "toolId" TEXT,
    "colorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolColors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_uz_key" ON "Color"("name_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_ru_key" ON "Color"("name_ru");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_en_key" ON "Color"("name_en");

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolColors" ADD CONSTRAINT "ToolColors_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolColors" ADD CONSTRAINT "ToolColors_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;
