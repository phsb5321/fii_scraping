import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAllStockService } from './update-all-stock.service';

describe('UpdateAllStockService', () => {
  let service: UpdateAllStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateAllStockService],
    }).compile();

    service = module.get<UpdateAllStockService>(UpdateAllStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
