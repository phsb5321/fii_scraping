// src/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeAllStocksService } from './scrape-all-stocks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';

describe('ScrapeAllStocksService', () => {
  let service: ScrapeAllStocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapeAllStocksService,
        // Mock for StockModelDB repository
        {
          provide: getRepositoryToken(StockModelDB),
          useValue: {}, // Mock object, can contain methods like find, findOne, etc.
        },
        // Mock for B3CrawlerProvider
        {
          provide: B3CrawlerProvider,
          useValue: {}, // Mock object, can contain methods this provider has.
        },
      ],
    }).compile();

    service = module.get<ScrapeAllStocksService>(ScrapeAllStocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
