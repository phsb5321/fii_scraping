/*
  Warnings:

  - A unique constraint covering the columns `[isin,stock_id]` on the table `stock_code` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stock_code_isin_stock_id_key" ON "stock_code"("isin", "stock_id");
