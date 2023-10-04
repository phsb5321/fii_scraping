import { OtherCode, StockEntity } from '@/app/entities/Stock/Stock.entity';
import { StockCodeEntity } from '@/app/entities/StockCode/StockCode';
import { PrismaService } from '@/app/infra/prisma/prisma.service';
import { BatchProcessorService } from '@/app/utils/batch-processor/batch-processor.service';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Stock } from '@prisma/client';

@Injectable()
export class UpdateAllStockService {
  private readonly logger = new Logger(UpdateAllStockService.name);

  // Define default configurations
  private readonly REQUESTS_LIMIT = 100;
  private readonly BATCH_SIZE = 50;
  private readonly TIME_FRAME_MULTIPLIER = 0.2 * 60 * 1000; // 0.2 minutes

  constructor(
    private readonly prisma: PrismaService,
    @Inject(B3CrawlerProvider)
    private readonly b3Crawler: B3CrawlerProvider,
    private readonly batchProcessorService: BatchProcessorService,
  ) {}

  async execute(): Promise<string> {
    const companies = await this.prisma.company.findMany({ select: { codeCVM: true } });

    if (companies.length === 0) {
      this.logger.verbose('No companies found');
      return 'No companies found';
    }

    this.logger.verbose(`Updating stocks for ${companies.length} companies`);

    await this.batchProcessorService.executeInBatches(
      companies,
      this.processBatch.bind(this),
      this.REQUESTS_LIMIT,
      this.BATCH_SIZE,
      this.TIME_FRAME_MULTIPLIER,
    );

    return `Updated details for ${companies.length} companies`;
  }

  private async processBatch(batch: { codeCVM: string }[]): Promise<void> {
    const stockDetails: StockEntity[] = await this.b3Crawler.getStockDetails(batch.map(company => company.codeCVM));
    this.logger.verbose(`Fetched ${stockDetails.length} stock details`);
    await Promise.all(
      stockDetails
        .filter(stock => stock.code) // Filter out stocks without a code
        .map((stockDetail, index) => this.processStock(batch[index].codeCVM, stockDetail)),
    );
  }

  private async processStock(companyCodeCVM: string, stockDetail: Partial<StockEntity>): Promise<void> {
    const company = await this.prisma.company.findUnique({ where: { codeCVM: companyCodeCVM } });
    if (!company) {
      this.logger.error(`Company with codeCVM ${companyCodeCVM} not found`);
      return;
    }

    // Prepare the data using the fromAbstract method
    const preparedStockDetail = StockEntity.fromAbstract(stockDetail);

    // Remove the codeCVM field as it's not part of the Stock model
    delete preparedStockDetail.codeCVM;

    const otherCodes = preparedStockDetail.otherCodes;
    delete preparedStockDetail.otherCodes;

    // Upsert the stock based on the company code.
    const upsertedStock = await this.prisma.stock.upsert({
      where: { code_companyId: { code: preparedStockDetail.code, companyId: company.id } },
      update: { ...preparedStockDetail, companyId: company.id },
      create: { ...preparedStockDetail, companyId: company.id } as Stock,
    });

    if (otherCodes?.length) {
      await this.updateOtherCodes(stockDetail.otherCodes, upsertedStock.id);
    }
  }

  private async updateOtherCodes(otherCodes: OtherCode[], stockId: number): Promise<void> {
    await Promise.all(
      otherCodes.map(async code => {
        const stockCodeEntity = StockCodeEntity.fromAbstract(code);
        await this.prisma.stockCode.upsert({
          where: {
            isin_stockId: { isin: stockCodeEntity.isin, stockId: stockId },
          },
          update: { isin: stockCodeEntity.isin, stockId: stockId },
          create: { ...stockCodeEntity, stockId: stockId },
        });
      }),
    );
  }
}
