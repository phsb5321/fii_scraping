/*
  Warnings:

  - You are about to alter the column `adjClose` on the `YahooHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,5)` to `Integer`.
  - You are about to alter the column `close` on the `YahooHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,5)` to `Integer`.
  - You are about to alter the column `high` on the `YahooHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,5)` to `Integer`.
  - You are about to alter the column `low` on the `YahooHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,5)` to `Integer`.
  - You are about to alter the column `open` on the `YahooHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,5)` to `Integer`.
  - You are about to alter the column `volume` on the `YahooHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,5)` to `Integer`.
  - Made the column `adjClose` on table `YahooHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `close` on table `YahooHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `high` on table `YahooHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `low` on table `YahooHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `open` on table `YahooHistory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `volume` on table `YahooHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "YahooHistory" ALTER COLUMN "adjClose" SET NOT NULL,
ALTER COLUMN "adjClose" SET DATA TYPE INTEGER,
ALTER COLUMN "close" SET NOT NULL,
ALTER COLUMN "close" SET DATA TYPE INTEGER,
ALTER COLUMN "high" SET NOT NULL,
ALTER COLUMN "high" SET DATA TYPE INTEGER,
ALTER COLUMN "low" SET NOT NULL,
ALTER COLUMN "low" SET DATA TYPE INTEGER,
ALTER COLUMN "open" SET NOT NULL,
ALTER COLUMN "open" SET DATA TYPE INTEGER,
ALTER COLUMN "volume" SET NOT NULL,
ALTER COLUMN "volume" SET DATA TYPE INTEGER;
