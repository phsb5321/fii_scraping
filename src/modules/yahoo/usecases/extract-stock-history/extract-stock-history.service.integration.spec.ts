import { PrismaService } from '@/app/infra/prisma/prisma.service';
import { BatchProcessorService } from '@/app/utils/batch-processor/batch-processor.service';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { Test, TestingModule } from '@nestjs/testing';
import { ExtractStockHistoryService } from './extract-stock-history.service';

describe('ExtractStockHistoryService Integration Test', () => {
  let service: ExtractStockHistoryService;
  let prismaService: PrismaService;
  let yahooCrawlerProvider: YahooCrawlerProvider;
  let batchProcessorService: BatchProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtractStockHistoryService, PrismaService, YahooCrawlerProvider, BatchProcessorService],
    }).compile();

    service = module.get<ExtractStockHistoryService>(ExtractStockHistoryService);
    prismaService = module.get<PrismaService>(PrismaService);
    yahooCrawlerProvider = module.get<YahooCrawlerProvider>(YahooCrawlerProvider);
    batchProcessorService = module.get<BatchProcessorService>(BatchProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(yahooCrawlerProvider).toBeDefined();
    expect(batchProcessorService).toBeDefined();
  });

  describe('execute method', () => {
    it('should return empty arrays if no stocks are found', async () => {
      const [histories, dividends] = await service.execute();

      expect(histories.length).toBe(0);
      expect(dividends.length).toBe(0);
    });

    it('should fetch and process stocks in batches', async () => {
      // Insert stocks into DB before testing
      await prismaService.stock.createMany({
        data: [
          { id: 1, code: 'stock1' },
          { id: 2, code: 'stock2' },
        ],
      });

      await service.execute();

      // Check if histories and dividends have been updated in DB
      const histories = await prismaService.yahooHistory.findMany();
      const dividends = await prismaService.yahooDividendHistory.findMany();

      expect(histories.length).toBeGreaterThan(0);
      expect(dividends.length).toBeGreaterThan(0);
    });

    it('should handle failure while fetching and updating stock data', async () => {
      // Use an invalid code for failure scenario
      await prismaService.stock.create({ data: { id: 3, code: 'invalid_code' } });

      await service.execute();

      // Expect no data inserted into history and dividend
      const histories = await prismaService.yahooHistory.findMany({ where: { stockId: 3 } });
      const dividends = await prismaService.yahooDividendHistory.findMany({ where: { stockId: 3 } });

      expect(histories.length).toBe(0);
      expect(dividends.length).toBe(0);
    });
  });
});
