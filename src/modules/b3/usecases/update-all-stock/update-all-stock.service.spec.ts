import { Repository } from 'typeorm';

import { Stock } from '@/app/entities/Stock/Stock.entity';
import { StockModelDB } from '@/app/models/Stock.model';
import { StockCodeModelDB } from '@/app/models/StockCode.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UpdateAllStockService', () => {
  let service: UpdateAllStockService;
  let stockModelRepository: Repository<StockModelDB>;
  let b3CrawlerProvider: B3CrawlerProvider;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAllStockService,
        {
          provide: getRepositoryToken(StockModelDB),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(StockCodeModelDB),
          useValue: {
            upsert: jest.fn(),
          },
        },
        {
          provide: B3CrawlerProvider,
          useValue: {
            getStockDetails: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            verbose: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateAllStockService>(UpdateAllStockService);
    stockModelRepository = module.get(getRepositoryToken(StockModelDB));
    b3CrawlerProvider = module.get<B3CrawlerProvider>(B3CrawlerProvider);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should return an empty array and log verbose message if no stocks found', async () => {
      (stockModelRepository.find as jest.Mock).mockResolvedValue([]);
      const result = await service.execute();
      expect(result).toEqual([]);
      expect(logger.verbose).toHaveBeenCalledWith('No stocks found');
    });

    it('should process stocks in batches and return updated stocks if stocks are found', async () => {
      const mockStocks: StockModelDB[] = [{ codeCVM: '1' } as StockModelDB, { codeCVM: '2' } as StockModelDB];
      (stockModelRepository.find as jest.Mock).mockResolvedValue(mockStocks);

      const mockStockDetails: Partial<Stock>[] = [{ codeCVM: '1' }, { codeCVM: '2' }];
      (b3CrawlerProvider.getStockDetails as jest.Mock).mockResolvedValue(mockStockDetails);

      const result = await service.execute();
      expect(result).toHaveLength(2);
      expect(stockModelRepository.save).toHaveBeenCalledTimes(2);
    });
  });
});
