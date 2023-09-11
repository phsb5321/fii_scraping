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

  it('should have otherCodes atribute', async () => {
    const stocks = await provider.getStockDetails('1023');
    const stock = stocks[0];
    expect(stock.otherCodes).toBeDefined();
  });

  describe('getStocks', () => {
    it('should not panic with empty stock list', async () => {
      // Arrange
      const emptyStockList: StockI[] = [];
      // Mocking getStocksFromPage that is a private method
      jest.spyOn(provider as any, 'getStocksFromPage').mockResolvedValueOnce({
        page: {
          totalRecords: 0,
          totalPages: 0,
        },
        results: emptyStockList,
      });

      // Act
      const stocks = await provider.getStocks();

      // Assert
      expect(stocks).toEqual(emptyStockList);
    });
  });
});
