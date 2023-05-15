// src/modules/b3/usecases/update-all-stock/update-all-stock.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAllStockService } from './update-all-stock.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { StockCodeModelDB } from '@/modules/b3/models/StockCode.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';

describe('UpdateAllStockService', () => {
  let service: UpdateAllStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAllStockService,
        {
          provide: getRepositoryToken(StockModelDB),
          useValue: {}, // Mock implementation or use a library like ts-mockito
        },
        {
          provide: getRepositoryToken(StockCodeModelDB),
          useValue: {}, // Mock implementation or use a library like ts-mockito
        },
        {
          provide: B3CrawlerProvider,
          useValue: {}, // Mock implementation or use a library like ts-mockito
        },
      ],
    }).compile();

    service = module.get<UpdateAllStockService>(UpdateAllStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
