/*
  Warnings:

  - You are about to drop the column `stocks.market_indicator` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "stocks.market_indicator";
