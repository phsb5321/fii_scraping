-- CreateTable
CREATE TABLE "stocks" (
    "id" SERIAL NOT NULL,
    "code_cvm" TEXT NOT NULL,
    "issuing_company" TEXT,
    "company_name" TEXT,
    "trading_name" TEXT,
    "cnpj" TEXT,
    "market_indicator" INTEGER,
    "type_bdr" TEXT,
    "date_listing" TIMESTAMP(3),
    "status" TEXT,
    "segment" TEXT,
    "segment_eng" TEXT,
    "type" INTEGER,
    "market" TEXT,
    "industry_classification" TEXT,
    "industry_classification_eng" TEXT,
    "activity" TEXT,
    "website" TEXT,
    "has_quotation" BOOLEAN,
    "institution_common" TEXT,
    "institution_preferred" TEXT,
    "code" TEXT NOT NULL,
    "has_emissions" BOOLEAN,
    "has_bdr" BOOLEAN,
    "describle_category_bvmf" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_code" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "isin" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yahoo_dividend_history" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dividend" DECIMAL(15,5) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "yahoo_dividend_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yahoo_history" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(15,5),
    "high" DECIMAL(15,5),
    "low" DECIMAL(15,5),
    "close" DECIMAL(15,5),
    "adj_close" DECIMAL(15,5),
    "volume" DECIMAL(15,5),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "yahoo_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stocks_code_cvm_key" ON "stocks"("code_cvm");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_code_key" ON "stocks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "stock_code_code_key" ON "stock_code"("code");

-- CreateIndex
CREATE UNIQUE INDEX "yahoo_history_stock_id_date_key" ON "yahoo_history"("stock_id", "date");

-- AddForeignKey
ALTER TABLE "stock_code" ADD CONSTRAINT "stock_code_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yahoo_dividend_history" ADD CONSTRAINT "yahoo_dividend_history_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yahoo_history" ADD CONSTRAINT "yahoo_history_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
