/*
  Warnings:

  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stocks.activity` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.cnpj` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.code_cvm` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.company_name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.created_at` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.id` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.industry_classification` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.industry_classification_eng` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.issuing_company` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.segment` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.segment_eng` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.trading_name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.updated_at` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.website` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stock_id` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.code` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.date_listing` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.describle_category_bvmf` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.has_bdr` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.has_emissions` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.has_quotation` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.institution_common` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.institution_preferred` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.market` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.market_indicator` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.status` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.type` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stocks.type_bdr` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Stock` table. All the data in the column will be lost.
  - The primary key for the `StockCode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stock_code.code` on the `StockCode` table. All the data in the column will be lost.
  - You are about to drop the column `stock_code.created_at` on the `StockCode` table. All the data in the column will be lost.
  - You are about to drop the column `stock_code.id` on the `StockCode` table. All the data in the column will be lost.
  - You are about to drop the column `stock_code.isin` on the `StockCode` table. All the data in the column will be lost.
  - You are about to drop the column `stock_code.stock_id` on the `StockCode` table. All the data in the column will be lost.
  - You are about to drop the column `stock_code.updated_at` on the `StockCode` table. All the data in the column will be lost.
  - The primary key for the `YahooDividendHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `yahoo_dividend_history.created_at` on the `YahooDividendHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_dividend_history.date` on the `YahooDividendHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_dividend_history.dividend` on the `YahooDividendHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_dividend_history.id` on the `YahooDividendHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_dividend_history.stock_id` on the `YahooDividendHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_dividend_history.updated_at` on the `YahooDividendHistory` table. All the data in the column will be lost.
  - The primary key for the `YahooHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `yahoo_history.adj_close` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.close` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.created_at` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.date` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.high` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.id` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.low` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.open` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.stock_id` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.updated_at` on the `YahooHistory` table. All the data in the column will be lost.
  - You are about to drop the column `yahoo_history.volume` on the `YahooHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codeCVM]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[isin,stockId]` on the table `StockCode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stockId,date]` on the table `YahooHistory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codeCVM` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isin` to the `StockCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockId` to the `StockCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StockCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `YahooDividendHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dividend` to the `YahooDividendHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockId` to the `YahooDividendHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `YahooDividendHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `YahooHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockId` to the `YahooHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `YahooHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "StockCode" DROP CONSTRAINT "StockCode_stock_code.stock_id_fkey";

-- DropForeignKey
ALTER TABLE "YahooDividendHistory" DROP CONSTRAINT "YahooDividendHistory_yahoo_dividend_history.stock_id_fkey";

-- DropForeignKey
ALTER TABLE "YahooHistory" DROP CONSTRAINT "YahooHistory_yahoo_history.stock_id_fkey";

-- DropIndex
DROP INDEX "Company_stocks.code_cvm_key";

-- DropIndex
DROP INDEX "StockCode_stock_code.isin_stock_code.stock_id_key";

-- DropIndex
DROP INDEX "YahooHistory_yahoo_history.stock_id_yahoo_history.date_key";

-- AlterTable
ALTER TABLE "Company" DROP CONSTRAINT "Company_pkey",
DROP COLUMN "stocks.activity",
DROP COLUMN "stocks.cnpj",
DROP COLUMN "stocks.code_cvm",
DROP COLUMN "stocks.company_name",
DROP COLUMN "stocks.created_at",
DROP COLUMN "stocks.id",
DROP COLUMN "stocks.industry_classification",
DROP COLUMN "stocks.industry_classification_eng",
DROP COLUMN "stocks.issuing_company",
DROP COLUMN "stocks.segment",
DROP COLUMN "stocks.segment_eng",
DROP COLUMN "stocks.trading_name",
DROP COLUMN "stocks.updated_at",
DROP COLUMN "stocks.website",
ADD COLUMN     "activity" TEXT,
ADD COLUMN     "cnpj" TEXT,
ADD COLUMN     "codeCVM" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "industryClassification" TEXT,
ADD COLUMN     "industryClassificationEng" TEXT,
ADD COLUMN     "issuingCompany" TEXT,
ADD COLUMN     "segment" TEXT,
ADD COLUMN     "segmentEng" TEXT,
ADD COLUMN     "tradingName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "website" TEXT,
ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "created_at",
DROP COLUMN "stock_id",
DROP COLUMN "stocks.code",
DROP COLUMN "stocks.date_listing",
DROP COLUMN "stocks.describle_category_bvmf",
DROP COLUMN "stocks.has_bdr",
DROP COLUMN "stocks.has_emissions",
DROP COLUMN "stocks.has_quotation",
DROP COLUMN "stocks.institution_common",
DROP COLUMN "stocks.institution_preferred",
DROP COLUMN "stocks.market",
DROP COLUMN "stocks.market_indicator",
DROP COLUMN "stocks.status",
DROP COLUMN "stocks.type",
DROP COLUMN "stocks.type_bdr",
DROP COLUMN "updated_at",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateListing" TIMESTAMP(3),
ADD COLUMN     "describleCategoryBVMF" TEXT,
ADD COLUMN     "hasBDR" BOOLEAN,
ADD COLUMN     "hasEmissions" BOOLEAN,
ADD COLUMN     "hasQuotation" BOOLEAN,
ADD COLUMN     "institutionCommon" TEXT,
ADD COLUMN     "institutionPreferred" TEXT,
ADD COLUMN     "market" TEXT,
ADD COLUMN     "marketIndicator" INTEGER,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "type" INTEGER,
ADD COLUMN     "typeBDR" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StockCode" DROP CONSTRAINT "StockCode_pkey",
DROP COLUMN "stock_code.code",
DROP COLUMN "stock_code.created_at",
DROP COLUMN "stock_code.id",
DROP COLUMN "stock_code.isin",
DROP COLUMN "stock_code.stock_id",
DROP COLUMN "stock_code.updated_at",
ADD COLUMN     "code" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "isin" TEXT NOT NULL,
ADD COLUMN     "stockId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "StockCode_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "YahooDividendHistory" DROP CONSTRAINT "YahooDividendHistory_pkey",
DROP COLUMN "yahoo_dividend_history.created_at",
DROP COLUMN "yahoo_dividend_history.date",
DROP COLUMN "yahoo_dividend_history.dividend",
DROP COLUMN "yahoo_dividend_history.id",
DROP COLUMN "yahoo_dividend_history.stock_id",
DROP COLUMN "yahoo_dividend_history.updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dividend" DECIMAL(15,5) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "stockId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "YahooDividendHistory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "YahooHistory" DROP CONSTRAINT "YahooHistory_pkey",
DROP COLUMN "yahoo_history.adj_close",
DROP COLUMN "yahoo_history.close",
DROP COLUMN "yahoo_history.created_at",
DROP COLUMN "yahoo_history.date",
DROP COLUMN "yahoo_history.high",
DROP COLUMN "yahoo_history.id",
DROP COLUMN "yahoo_history.low",
DROP COLUMN "yahoo_history.open",
DROP COLUMN "yahoo_history.stock_id",
DROP COLUMN "yahoo_history.updated_at",
DROP COLUMN "yahoo_history.volume",
ADD COLUMN     "adjClose" DECIMAL(15,5),
ADD COLUMN     "close" DECIMAL(15,5),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "high" DECIMAL(15,5),
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "low" DECIMAL(15,5),
ADD COLUMN     "open" DECIMAL(15,5),
ADD COLUMN     "stockId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "volume" DECIMAL(15,5),
ADD CONSTRAINT "YahooHistory_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_codeCVM_key" ON "Company"("codeCVM");

-- CreateIndex
CREATE UNIQUE INDEX "StockCode_isin_stockId_key" ON "StockCode"("isin", "stockId");

-- CreateIndex
CREATE UNIQUE INDEX "YahooHistory_stockId_date_key" ON "YahooHistory"("stockId", "date");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCode" ADD CONSTRAINT "StockCode_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YahooDividendHistory" ADD CONSTRAINT "YahooDividendHistory_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YahooHistory" ADD CONSTRAINT "YahooHistory_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
