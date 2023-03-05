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
    jest.setTimeout(20000); // 20 seconds
    const stocks = await provider.getStocks();
    console.log("🚀 ~ file: b3_crawler.provider.spec.ts:27 ~ it ~ stocks:", stocks)

    expect(stocks).toBeDefined();
  });

  it('should be able to get stocks and convert them to StockI', async () => {
    jest.setTimeout(20000); // 20 seconds
    const stocks = await provider.getStocks();

    stocks.forEach((stock: StockI) => {
      expect(stock.codeCVM).toBeDefined();
      expect(stock.issuingCompany).toBeDefined();
      expect(stock.companyName).toBeDefined();
      expect(stock.tradingName).toBeDefined();
      expect(stock.cnpj).toBeDefined();
      expect(stock.marketIndicator).toBeDefined();
      expect(stock.dateListing).toBeInstanceOf(Date);
      expect(stock.status).toBeDefined();
      expect(stock.segment).toBeDefined();
      expect(stock.segmentEng).toBeDefined();
      expect(stock.type).toBeDefined();
      expect(stock.market).toBeDefined();
    });
  });
});
