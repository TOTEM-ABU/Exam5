/*
  Warnings:

  - You are about to drop the column `name_en` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the column `name_ru` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the column `name_uz` on the `Level` table. All the data in the column will be lost.
  - Added the required column `name` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LevelType" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED');

-- DropIndex
DROP INDEX "Level_name_en_key";

-- DropIndex
DROP INDEX "Level_name_ru_key";

-- DropIndex
DROP INDEX "Level_name_uz_key";

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "name_en",
DROP COLUMN "name_ru",
DROP COLUMN "name_uz",
ADD COLUMN     "name" "LevelType" NOT NULL;
