/*
  Warnings:

  - You are about to drop the `stock_code` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `yahoo_dividend_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `yahoo_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "stock_code" DROP CONSTRAINT "stock_code_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "yahoo_dividend_history" DROP CONSTRAINT "yahoo_dividend_history_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "yahoo_history" DROP CONSTRAINT "yahoo_history_stock_id_fkey";

-- DropTable
DROP TABLE "stock_code";

-- DropTable
DROP TABLE "stocks";

-- DropTable
DROP TABLE "yahoo_dividend_history";

-- DropTable
DROP TABLE "yahoo_history";

-- CreateTable
CREATE TABLE "Company" (
    "stocks.id" SERIAL NOT NULL,
    "stocks.code_cvm" TEXT NOT NULL,
    "stocks.issuing_company" TEXT,
    "stocks.company_name" TEXT,
    "stocks.trading_name" TEXT,
    "stocks.cnpj" TEXT,
    "stocks.website" TEXT,
    "stocks.segment" TEXT,
    "stocks.segment_eng" TEXT,
    "stocks.industry_classification" TEXT,
    "stocks.industry_classification_eng" TEXT,
    "stocks.activity" TEXT,
    "stocks.created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stocks.updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("stocks.id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "stocks.market_indicator" INTEGER,
    "stocks.type_bdr" TEXT,
    "stocks.date_listing" TIMESTAMP(3),
    "stocks.status" TEXT,
    "stocks.type" INTEGER,
    "stocks.market" TEXT,
    "stocks.has_quotation" BOOLEAN,
    "stocks.institution_common" TEXT,
    "stocks.institution_preferred" TEXT,
    "stocks.code" TEXT NOT NULL,
    "stocks.has_emissions" BOOLEAN,
    "stocks.has_bdr" BOOLEAN,
    "stocks.describle_category_bvmf" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCode" (
    "stock_code.id" SERIAL NOT NULL,
    "stock_code.stock_id" INTEGER NOT NULL,
    "stock_code.code" TEXT,
    "stock_code.isin" TEXT NOT NULL,
    "stock_code.created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stock_code.updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockCode_pkey" PRIMARY KEY ("stock_code.id")
);

-- CreateTable
CREATE TABLE "YahooDividendHistory" (
    "yahoo_dividend_history.id" SERIAL NOT NULL,
    "yahoo_dividend_history.stock_id" INTEGER NOT NULL,
    "yahoo_dividend_history.date" TIMESTAMP(3) NOT NULL,
    "yahoo_dividend_history.dividend" DECIMAL(15,5) NOT NULL,
    "yahoo_dividend_history.created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "yahoo_dividend_history.updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YahooDividendHistory_pkey" PRIMARY KEY ("yahoo_dividend_history.id")
);

-- CreateTable
CREATE TABLE "YahooHistory" (
    "yahoo_history.id" SERIAL NOT NULL,
    "yahoo_history.stock_id" INTEGER NOT NULL,
    "yahoo_history.date" TIMESTAMP(3) NOT NULL,
    "yahoo_history.open" DECIMAL(15,5),
    "yahoo_history.high" DECIMAL(15,5),
    "yahoo_history.low" DECIMAL(15,5),
    "yahoo_history.close" DECIMAL(15,5),
    "yahoo_history.adj_close" DECIMAL(15,5),
    "yahoo_history.volume" DECIMAL(15,5),
    "yahoo_history.created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "yahoo_history.updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YahooHistory_pkey" PRIMARY KEY ("yahoo_history.id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_stocks.code_cvm_key" ON "Company"("stocks.code_cvm");

-- CreateIndex
CREATE UNIQUE INDEX "StockCode_stock_code.isin_stock_code.stock_id_key" ON "StockCode"("stock_code.isin", "stock_code.stock_id");

-- CreateIndex
CREATE UNIQUE INDEX "YahooHistory_yahoo_history.stock_id_yahoo_history.date_key" ON "YahooHistory"("yahoo_history.stock_id", "yahoo_history.date");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Company"("stocks.id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCode" ADD CONSTRAINT "StockCode_stock_code.stock_id_fkey" FOREIGN KEY ("stock_code.stock_id") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YahooDividendHistory" ADD CONSTRAINT "YahooDividendHistory_yahoo_dividend_history.stock_id_fkey" FOREIGN KEY ("yahoo_dividend_history.stock_id") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YahooHistory" ADD CONSTRAINT "YahooHistory_yahoo_history.stock_id_fkey" FOREIGN KEY ("yahoo_history.stock_id") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
