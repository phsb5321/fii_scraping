import { StockModelDB } from '@/app/models/Stock.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractStockHistoryService } from './extract-stock-history.service';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: { warn: jest.fn(), verbose: jest.fn(), error: jest.fn() },
}));

describe('ExtractStockHistoryService', () => {
  let service: ExtractStockHistoryService;
  let repository: Repository<StockModelDB>;
  let b3Crawler: B3CrawlerProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExtractStockHistoryService,
        {
          provide: getRepositoryToken(StockModelDB),
          useClass: Repository,
        },
        {
          provide: B3CrawlerProvider,
          useValue: { getStockDetails: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ExtractStockHistoryService>(ExtractStockHistoryService);
    repository = module.get<Repository<StockModelDB>>(getRepositoryToken(StockModelDB));
    b3Crawler = module.get<B3CrawlerProvider>(B3CrawlerProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should log a warning and return an empty array if no stocks are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      const result = await service.execute();
      expect(mocked(Logger.warn)).toHaveBeenCalledWith('No stocks found');
      expect(result).toEqual([]);
    });

    it('should process stocks in batches and return updated stocks', async () => {
      const stocks: Partial<StockModelDB>[] = [{ codeCVM: '1' }, { codeCVM: '2' }];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(stocks as StockModelDB[]);
      jest.spyOn(repository, 'find').mockResolvedValueOnce(stocks as StockModelDB[]);
      jest.spyOn(service as any, 'processStocksInBatches').mockResolvedValueOnce(undefined);

      const result = await service.execute();
      expect(mocked(Logger.verbose)).toHaveBeenCalledWith(`Updating ${stocks.length} stocks`);
      expect((service as any).processStocksInBatches).toHaveBeenCalledWith([1, 2]);
      expect(result).toEqual(stocks as StockModelDB[]);
    });
  });

  describe('processBatch', () => {
    it('should process each stock in the batch', async () => {
      const batch = [1, 2];
      const stockDetails = [{}, {}];
      jest.spyOn(b3Crawler, 'getStockDetails').mockResolvedValueOnce(stockDetails);
      jest.spyOn(service as any, 'updateStock').mockResolvedValueOnce(undefined);

      await (service as any).processBatch(batch);
      expect((service as any).updateStock).toHaveBeenCalledTimes(batch.length);
    });
  });

  describe('updateStock', () => {
    it('should update the stock if found', async () => {
      const stockCode = 1;
      const stockDetail: Partial<StockModelDB> = { codeCVM: '1' };
      const stock: StockModelDB = {
        id: 1,
        codeCVM: '1',
        updatedAt: new Date(),
      } as StockModelDB;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(stock);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(stock);

      await (service as any).updateStock(stockCode, stockDetail);
      expect(repository.save).toHaveBeenCalledWith({
        ...stock,
        ...stockDetail,
        updatedAt: expect.any(Date),
      });
    });

    it('should log an error if the stock is not found', async () => {
      const stockCode = 1;
      const stockDetail: Partial<StockModelDB> = { codeCVM: '1' };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await (service as any).updateStock(stockCode, stockDetail);
      expect(mocked(Logger.error)).toHaveBeenCalledWith(`Stock with codeCVM ${stockCode} not found`);
    });
  });
});
