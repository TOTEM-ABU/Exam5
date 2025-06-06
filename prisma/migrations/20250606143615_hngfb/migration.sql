/*
  Warnings:

  - Added the required column `priceDaily` to the `ProductLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceHourly` to the `ProductLevel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductLevel" ADD COLUMN     "priceDaily" INTEGER NOT NULL,
ADD COLUMN     "priceHourly" INTEGER NOT NULL;
