import { Repository } from 'typeorm';

import { Stock } from '@/app/entities/Stock/Stock.entity';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { StockModelDB } from '@/app/models/Stock.model';
import { ScrapeAllStocksService } from './scrape-all-stocks.service';

describe('ScrapeAllStocksService', () => {
  let service: ScrapeAllStocksService;
  let mockRepository: jest.Mocked<Repository<StockModelDB>>;
  let mockB3CrawlerProvider: jest.Mocked<B3CrawlerProvider>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockRepository = {
      upsert: jest.fn(),
    } as unknown as jest.Mocked<Repository<StockModelDB>>;

    mockB3CrawlerProvider = {
      getStocks: jest.fn(),
    } as unknown as jest.Mocked<B3CrawlerProvider>;

    mockLogger = {
      verbose: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapeAllStocksService,
        {
          provide: getRepositoryToken(StockModelDB),
          useValue: mockRepository,
        },
        {
          provide: B3CrawlerProvider,
          useValue: mockB3CrawlerProvider,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ScrapeAllStocksService>(ScrapeAllStocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute()', () => {
    it('should fetch stocks from B3Crawler, upsert them to the repository, log the correct message and return the new stocks', async () => {
      // Arrange
      const mockStocks: Stock[] = [new Stock(), new Stock()];
      mockB3CrawlerProvider.getStocks.mockResolvedValueOnce(mockStocks);

      const mockNewStocks: StockModelDB[] = [new StockModelDB(), new StockModelDB()];
      mockRepository.upsert.mockResolvedValueOnce({
        generatedMaps: mockNewStocks,
      } as any);

      // Act
      const newStocks = await service.execute();

      // Assert
      expect(mockB3CrawlerProvider.getStocks).toHaveBeenCalledTimes(1);
      expect(mockRepository.upsert).toHaveBeenCalledWith(mockStocks, [
        'tradingName',
        'issuingCompany',
        'codeCVM',
        'cnpj',
      ]);
      expect(mockLogger.verbose).toHaveBeenCalledWith(`Found ${mockNewStocks.length} new stocks`);
      expect(newStocks).toEqual(mockNewStocks);
    });
  });
});
