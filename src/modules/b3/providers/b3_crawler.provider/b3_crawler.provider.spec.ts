import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { Test, TestingModule } from '@nestjs/testing';

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

  it(
    'should be able to get stocks',
    async () => {
      const stocks = await provider.getStocks();
      expect(stocks).toBeDefined();
    },
    2 * 60 * 1000,
  );

  it(
    'should have otherCodes atribute',
    async () => {
      const stocks = await provider.getStockDetails('4170');
      const stock = stocks[0];
      expect(stock.otherCodes).toBeDefined();
    },
    2 * 60 * 1000,
  );

  it(
    'should get the stock details',
    async () => {
      const stocks = await provider.getStockDetails('1023');
      const stock = stocks[0];
      expect(stock).toBeDefined();
    },
    2 * 60 * 1000,
  );
});
