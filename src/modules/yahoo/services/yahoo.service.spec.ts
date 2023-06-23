//src/modules/yahoo/services/yahoo.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { YahooService } from './yahoo.service';
import { UpdateYahooStockHistoryService } from '@/modules/yahoo/usecases/update-yahoo-stock-history/update-yahoo-stock-history.service';
import { UpdateYahooStockDividendsService } from '@/modules/yahoo/usecases/update-yahoo-stock-dividends/update-yahoo-stock-dividends.service';

describe('YahooService', () => {
  let service: YahooService;

  beforeEach(async () => {
    const mockUpdateYahooStockHistoryService = {}; // Implement mock logic here
    const mockUpdateYahooStockDividendsService = {}; // Implement mock logic here

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YahooService,
        {
          provide: UpdateYahooStockHistoryService,
          useValue: mockUpdateYahooStockHistoryService,
        },
        {
          provide: UpdateYahooStockDividendsService,
          useValue: mockUpdateYahooStockDividendsService,
        },
      ],
    }).compile();

    service = module.get<YahooService>(YahooService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
