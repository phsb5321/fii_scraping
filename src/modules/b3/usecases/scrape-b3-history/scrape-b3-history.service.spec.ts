import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeB3HistoryService } from './scrape-b3-history.service';

describe('ScrapeB3HistoryService', () => {
  let service: ScrapeB3HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeB3HistoryService],
    }).compile();

    service = module.get<ScrapeB3HistoryService>(ScrapeB3HistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
