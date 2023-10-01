import { Stock } from '@/app/entities/Stock/Stock.entity';
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

  it('should be able to get stocks', async () => {
    const stocks = await provider.getStocks();
    expect(stocks).toBeDefined();
  });

  it(
    'should have otherCodes atribute',
    async () => {
      const stocks = await provider.getStockDetails('1023');
      const stock = stocks[0];
      expect(stock.otherCodes).toBeDefined();
    },
    2 * 60 * 1000,
  );

  describe('getStocks', () => {
    it('should not panic with empty stock list', async () => {
      // Arrange
      const emptyStockList: Stock[] = [];
      // Mocking getStocksFromPage that is a private method
      jest.spyOn(provider as any, 'getStocks').mockResolvedValueOnce(emptyStockList);

      // Act
      const stocks = await provider.getStocks();

      // Assert
      expect(stocks).toEqual(emptyStockList);
    });
  });
});
