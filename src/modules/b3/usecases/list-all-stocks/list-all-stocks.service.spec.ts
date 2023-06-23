// src/modules/b3/usecases/list-all-stocks/list-all-stocks.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ListAllStocksService } from './list-all-stocks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockModelDB } from '@/modules/b3/models/Stock.model';

describe('ListAllStocksService', () => {
  let service: ListAllStocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAllStocksService,
        // provide a mock repository
        {
          provide: getRepositoryToken(StockModelDB),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ListAllStocksService>(ListAllStocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
