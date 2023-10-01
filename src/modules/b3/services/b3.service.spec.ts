// src/modules/b3/services/b3.service.spec.ts
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { B3Service } from '@/modules/b3/services/b3.service';
import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('B3Service', () => {
  let service: B3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        B3Service,
        B3CrawlerProvider,
        {
          provide: ScrapeAllStocksService,
          useValue: {
            execute: jest.fn().mockResolvedValue([]), // Mocked implementation
          },
        },
        // Mocking UpdateAllStockService
        {
          provide: UpdateAllStockService,
          useValue: {
            execute: jest.fn().mockResolvedValue([]), // Mocked implementation
          },
        },
      ],
    }).compile();

    service = module.get<B3Service>(B3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
