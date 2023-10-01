// src/modules/yahoo/usecases/update-yahoo-stock-history/update-yahoo-stock-history.service.spec.ts

import { StockModelDB } from '@/app/models/Stock.model';
import { YahooHistoryModelDB } from '@/app/models/YahooHistory.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { UpdateYahooStockHistoryService } from '@/modules/yahoo/usecases/update-yahoo-stock-history/update-yahoo-stock-history.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UpdateYahooStockHistoryService', () => {
  let service: UpdateYahooStockHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateYahooStockHistoryService,
        {
          provide: getRepositoryToken(YahooHistoryModelDB),
          useValue: {}, // provide the mock implementation here
        },
        {
          provide: getRepositoryToken(StockModelDB),
          useValue: {}, // provide the mock implementation here
        },
        {
          provide: YahooCrawlerProvider,
          useValue: {}, // provide the mock implementation here
        },
      ],
    }).compile();

    service = module.get<UpdateYahooStockHistoryService>(UpdateYahooStockHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
