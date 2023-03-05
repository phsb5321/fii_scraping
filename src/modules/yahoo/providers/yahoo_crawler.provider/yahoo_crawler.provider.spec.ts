import { Test, TestingModule } from '@nestjs/testing';
import { YahooCrawlerProvider, StockYahooI } from './yahoo_crawler.provider';

describe('YahooCrawlerProvider', () => {
  let provider: YahooCrawlerProvider;

  beforeAll(() => {
    // Set time out to 20s
    jest.setTimeout(20000);
  })

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
    console.log("🚀 ~ file: yahoo_crawler.provider.spec.ts:27 ~ it ~ stock:", stock)
    expect(stock).toBeDefined();
  });

  it('should return a stock with the correct keys', async () => {
    // Get the stock
    const stockCode = 'PETR4.SA';
    const stock = await provider.getStock(stockCode);

    // Get the keys
    const keys = Object.keys(stock[0]);

    // Check if the keys are correct
    expect(keys).toEqual([
      'date',
      'open',
      'high',
      'low',
      'close',
      'adjClose',
      'volume',
    ]);
  });

});

