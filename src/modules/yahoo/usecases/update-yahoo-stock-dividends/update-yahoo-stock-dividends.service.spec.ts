import { Test, TestingModule } from '@nestjs/testing';
import { UpdateYahooStockDividendsService } from './update-yahoo-stock-dividends.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { YahooDividendHistoryModelDB } from '@/modules/yahoo/models/YahooDividendHistory.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';

describe('UpdateYahooStockDividendsService', () => {
  let service: UpdateYahooStockDividendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateYahooStockDividendsService,
        // Mock the StockModelDB Repository
        {
          provide: getRepositoryToken(StockModelDB),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            save: jest.fn(),
          },
        },
        // Mock the YahooDividendHistoryModelDBRepository
        {
          provide: getRepositoryToken(YahooDividendHistoryModelDB),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            save: jest.fn(),
            upsert: jest.fn(),
          },
        },
        // Mock the YahooCrawlerProvider
        {
          provide: YahooCrawlerProvider,
          useValue: {
            getStockdividend: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateYahooStockDividendsService>(UpdateYahooStockDividendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
