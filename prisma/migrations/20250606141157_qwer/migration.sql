/*
  Warnings:

  - You are about to drop the column `message` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Capacity" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "message";

-- AlterTable
ALTER TABLE "Master" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Size" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "createdBy" TEXT;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Capacity" ADD CONSTRAINT "Capacity_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
