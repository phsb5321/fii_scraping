import { Test, TestingModule } from '@nestjs/testing';
import { UpdateYahooStockDividendsService } from './update-yahoo-stock-dividends.service';

describe('UpdateYahooStockDividendsService', () => {
  let service: UpdateYahooStockDividendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateYahooStockDividendsService],
    }).compile();

    service = module.get<UpdateYahooStockDividendsService>(UpdateYahooStockDividendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
