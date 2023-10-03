/*
  Warnings:

  - A unique constraint covering the columns `[stockId,date]` on the table `YahooDividendHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "YahooDividendHistory_stockId_date_key" ON "YahooDividendHistory"("stockId", "date");
