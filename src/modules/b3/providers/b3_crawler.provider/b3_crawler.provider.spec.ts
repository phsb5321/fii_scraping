import { Test, TestingModule } from '@nestjs/testing';
import { B3CrawlerProvider } from './b3_crawler.provider';
import { StockI } from '@/app/entities/Stock/Stock.entity';

describe('B3CrawlerProvider', () => {
  let provider: B3CrawlerProvider;

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
    console.log(
      '🚀 ~ file: b3_crawler.provider.spec.ts:27 ~ it ~ stocks:',
      stocks,
    );
    expect(stocks).toBeDefined();
  });
});
