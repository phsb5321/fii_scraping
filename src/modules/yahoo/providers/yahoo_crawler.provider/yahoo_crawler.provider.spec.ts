import { Test, TestingModule } from '@nestjs/testing';
import { YahooCrawlerProvider } from './yahoo_crawler.provider';

describe('YahooCrawlerProvider', () => {
  let provider: YahooCrawlerProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YahooCrawlerProvider],
    }).compile();

    provider = module.get<YahooCrawlerProvider>(YahooCrawlerProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should return a stock', async () => {
    const stockCode = 'PETR4.SA';
    const stock = await provider.getStock(stockCode);
    console.log("🚀 ~ file: yahoo_crawler.provider.spec.ts:22 ~ it ~ stock:", stock)
    expect(stock).toBeDefined();
  });
});
