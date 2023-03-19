import { Test, TestingModule } from '@nestjs/testing';
import { UpdateYahooStockHistoryService } from './update-yahoo-stock-history.service';

describe('UpdateYahooStockHistoryService', () => {
  let service: UpdateYahooStockHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateYahooStockHistoryService],
    }).compile();

    service = module.get<UpdateYahooStockHistoryService>(UpdateYahooStockHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
