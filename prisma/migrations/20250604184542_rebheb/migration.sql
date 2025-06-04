/*
  Warnings:

  - The values [USER_FIZ,USER_YUR] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleType_new" AS ENUM ('ADMIN', 'USER', 'SUPER_ADMIN', 'VIEWER_ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "RoleType_new" USING ("role"::text::"RoleType_new");
ALTER TYPE "RoleType" RENAME TO "RoleType_old";
ALTER TYPE "RoleType_new" RENAME TO "RoleType";
DROP TYPE "RoleType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL;
