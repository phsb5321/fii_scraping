/*
  Warnings:

  - Made the column `code` on table `stocks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "stocks_code_key";

-- AlterTable
ALTER TABLE "stocks" ALTER COLUMN "code" SET NOT NULL;
