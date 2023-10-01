import { StockCodeModelDB } from '@/app/models/StockCode.model';
import { YahooDividendHistoryModelDB } from '@/app/models/YahooDividendHistory.model';
import { YahooHistoryModelDB } from '@/app/models/YahooHistory.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { ExtractStockHistoryService } from '@/modules/yahoo/usecases/extract-stock-history/extract-stock-history.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ExtractStockHistoryService Integration Tests', () => {
  let service: ExtractStockHistoryService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql', // Database type
          host: process.env.MYSQL_HOST, // Database host
          port: 3306, // Database port
          username: 'root', // Database username
          password: process.env.MYSQL_ROOT_PASSWORD, // Database password
          database: process.env.MYSQL_DATABASE, // Database name
          autoLoadEntities: true, // Auto-load all entities
          timezone: '-03:00', // Set Brazil timezone
          dateStrings: true, // Enable date strings formatting
          migrationsRun: true, // Run migrations automatically
          synchronize: true, // Synchronize database schema with entities
        }),
        TypeOrmModule.forFeature([StockCodeModelDB, YahooHistoryModelDB, YahooDividendHistoryModelDB]),
      ],
      providers: [ExtractStockHistoryService, YahooCrawlerProvider],
    }).compile();

    service = module.get<ExtractStockHistoryService>(ExtractStockHistoryService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    let stockCodes: Repository<StockCodeModelDB>;
    let yahooHistoryRepo: Repository<YahooHistoryModelDB>;
    let yahooDividendRepo: Repository<YahooDividendHistoryModelDB>;

    beforeEach(async () => {
      stockCodes = module.get<Repository<StockCodeModelDB>>(getRepositoryToken(StockCodeModelDB));
      yahooHistoryRepo = module.get<Repository<YahooHistoryModelDB>>(getRepositoryToken(YahooHistoryModelDB));
      yahooDividendRepo = module.get<Repository<YahooDividendHistoryModelDB>>(
        getRepositoryToken(YahooDividendHistoryModelDB),
      );

      // Create Sample StockCode
      const stockCode = stockCodes.create({ code: 'AAPL' });
      await stockCodes.save(stockCode);
    });

    it('should fetch and update stock histories and dividends', async () => {
      // Execute Service
      const [histories, dividends] = await service.execute();

      expect(histories).toBeDefined();
      expect(dividends).toBeDefined();

      // Validate that the data was saved correctly
      const savedHistories = await yahooHistoryRepo.find();
      const savedDividends = await yahooDividendRepo.find();

      expect(savedHistories.length).toBeGreaterThan(0);
      expect(savedDividends.length).toBeGreaterThan(0);
    });

    it('should handle no stock codes found', async () => {
      // Clear all stock codes
      await stockCodes.clear();

      // Execute Service
      const [histories, dividends] = await service.execute();

      expect(histories).toEqual([]);
      expect(dividends).toEqual([]);

      // Validate that no data was saved
      const savedHistories = await yahooHistoryRepo.find();
      const savedDividends = await yahooDividendRepo.find();

      expect(savedHistories.length).toEqual(0);
      expect(savedDividends.length).toEqual(0);
    });

    it('should handle fetching errors from YahooCrawlerProvider', async () => {
      // Mock YahooCrawlerProvider to throw an error
      const yahooCrawlerProvider = module.get<YahooCrawlerProvider>(YahooCrawlerProvider);
      jest
        .spyOn(yahooCrawlerProvider, 'getStockTradeHistory')
        .mockRejectedValue(new Error('Failed to fetch data from Yahoo'));

      // Execute Service
      const [histories, dividends] = await service.execute();

      expect(histories).toBeDefined();
      expect(dividends).toBeDefined();

      // Validate that no data was saved
      const savedHistories = await yahooHistoryRepo.find();
      const savedDividends = await yahooDividendRepo.find();

      expect(savedHistories.length).toEqual(0);
      expect(savedDividends.length).toEqual(0);
    });

    it('should handle invalid data from YahooCrawlerProvider', async () => {
      // Mock YahooCrawlerProvider to return invalid data
      const yahooCrawlerProvider = module.get<YahooCrawlerProvider>(YahooCrawlerProvider);
      jest.spyOn(yahooCrawlerProvider, 'getStockTradeHistory').mockResolvedValue([
        {
          date: new Date(),
          adjClose: 3,
          volume: 100,
          open: 1,
          high: 2,
          low: 1,
          close: 2,
        },
      ]);

      // Execute Service
      const [histories, dividends] = await service.execute();

      expect(histories).toBeDefined();
      expect(dividends).toBeDefined();

      // Validate that no data was saved
      const savedHistories = await yahooHistoryRepo.find();
      const savedDividends = await yahooDividendRepo.find();

      expect(savedHistories.length).toEqual(0);
      expect(savedDividends.length).toEqual(0);
    });
  });

  describe('processStocksInBatches', () => {
    let stockCodes: Repository<StockCodeModelDB>;

    beforeEach(async () => {
      stockCodes = module.get<Repository<StockCodeModelDB>>(getRepositoryToken(StockCodeModelDB));
    });
    it('should process stocks in batches', async () => {
      const stockCodesData = [{ code: 'AAPL' }, { code: 'GOOGL' }, { code: 'TSLA' }, { code: 'AMZN' }];
      const createdStockCodes = await stockCodes.save(stockCodes.create(stockCodesData));
      await service['processStocksInBatches'](createdStockCodes);
      // TODO!: Validate that the data was saved correctly
    });

    // INCOMPLETE TEST
    it('should handle empty stock codes', async () => {
      await service['processStocksInBatches']([]);
      // TODO!: Validate that the data was saved correctly
    });
  });
});
