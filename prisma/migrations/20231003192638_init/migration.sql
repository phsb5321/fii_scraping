/*
  Warnings:

  - A unique constraint covering the columns `[code,companyId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stock_code_companyId_key" ON "Stock"("code", "companyId");
