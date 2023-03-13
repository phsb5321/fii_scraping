import { Test, TestingModule } from '@nestjs/testing';
import { B3CrawlerProvider } from './b3_crawler.provider';
import { StockI } from '@/app/entities/Stock/Stock.entity';

describe('B3CrawlerProvider', () => {
  let provider: B3CrawlerProvider;

  beforeAll(() => {
    jest.setTimeout(20000); // 20 seconds
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [B3CrawlerProvider],
    }).compile();
    provider = module.get<B3CrawlerProvider>(B3CrawlerProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should be able to get stocks', async () => {
    const stocks = await provider.getStocks();
    expect(stocks).toBeDefined();
  });

  it('should have otherCodes', async () => {
    const stocks = await provider.getStockDetails('1023');
    const stock = stocks[0];
    expect(stock.otherCodes).toBeDefined();
  })
});
