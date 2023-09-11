// src/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider.spec.ts

import { YahooDividend } from '@/app/entities/Dividend/Dividend.entity';
import { YahooStockHistory } from '@/app/entities/YahooHistory/YahooHistory.entity';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { YahooCrawlerProvider } from './yahoo_crawler.provider';

// Mock the axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('YahooCrawlerProvider', () => {
  let provider: YahooCrawlerProvider;

  beforeAll(() => {
    // Set time out to 20s
    jest.setTimeout(20000);
  });

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

    // Mock the axios response
    mockedAxios.get.mockResolvedValueOnce({ data: 'your CSV data here' });

    const stock = await provider.getStockTradeHistory(stockCode);
    expect(stock).toBeDefined();
  });

  it('should return a stock with the correct keys', async () => {
    // Get the stock
    const stockCode = 'BBAS3.SA';

    // Mock the axios response
    mockedAxios.get.mockResolvedValueOnce({ data: 'your CSV data here' });

    const stock = await provider.getStockTradeHistory(stockCode);

    // Get the keys
    const keys = Object.keys(stock[0]);

    // Get the keys from the entity
    const entityKeys = Object.keys(new YahooStockHistory(stock[0]));

    // Compare the keys
    expect(keys).toEqual(entityKeys);
  });

  // Test getStockdividend
  it('should return a stock dividend', async () => {
    const stockCode = 'PETR4.SA';

    // Simulate a successful HTTP response
    mockedAxios.get.mockResolvedValueOnce({ data: 'your CSV data here' });

    const stock = await provider.getStockdividend(stockCode);
    expect(stock).toBeDefined();
  });

  it('should return a stock with the correct dividend keys', async () => {
    // Get the stock
    const stockCode = 'BBAS3.SA';

    // Mock the axios response
    mockedAxios.get.mockResolvedValueOnce({ data: 'your CSV data here' });

    const stock = await provider.getStockdividend(stockCode);

    // Get the keys
    const keys = Object.keys(stock[0]);

    // Get the keys from the entity
    const entityKeys = Object.keys(new YahooDividend(stock[0]));

    // Compare the keys
    expect(keys).toEqual(entityKeys);
  });
});
