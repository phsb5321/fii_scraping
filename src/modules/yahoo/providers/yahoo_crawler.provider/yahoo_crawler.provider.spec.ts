// src/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider.spec.ts

import { YahooDividendEntity } from '@/app/entities/Dividend/Dividend.entity';
import { YahooStockHistoryEntity } from '@/app/entities/YahooHistory/YahooHistory.entity';
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
    const stock = await provider.getStockTradeHistory(stockCode);
    expect(stock).toBeDefined();
  });

  it(
    'should return a stock with the correct keys',
    async () => {
      const stockCode = 'AFLT3.SA';
      const stock = await provider.getStockTradeHistory(stockCode);
      const keys = Object.keys(stock[0]);
      const entityKeys = Object.keys(new YahooStockHistoryEntity(stock[0]));
      expect(keys).toEqual(entityKeys);
    },
    2 * 60 * 1000,
  );

  // Test getStockdividend
  it('should return a stock dividend', async () => {
    const stockCode = 'PETR4.SA';
    const stock = await provider.getStockdividend(stockCode);
    expect(stock).toBeDefined();
  });

  it(
    'should return a stock with the correct dividend keys',
    async () => {
      const stockCode = 'BMEB4.SA';
      const stock = await provider.getStockdividend(stockCode);
      const keys = Object.keys(stock[0]);
      const entityKeys = Object.keys(new YahooDividendEntity(stock[0]));
      expect(keys).toEqual(entityKeys);
    },
    2 * 60 * 1000,
  );
});
