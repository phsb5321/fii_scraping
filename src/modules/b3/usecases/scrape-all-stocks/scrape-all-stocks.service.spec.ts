import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeAllStocksService } from './scrape-all-stocks.service';

describe('ScrapeAllStocksService', () => {
  let service: ScrapeAllStocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeAllStocksService],
    }).compile();

    service = module.get<ScrapeAllStocksService>(ScrapeAllStocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
