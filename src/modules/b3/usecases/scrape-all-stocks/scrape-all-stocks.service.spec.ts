import { PrismaService } from '@/app/infra/prisma/prisma.service';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeAllStocksService } from './scrape-all-stocks.service';

describe('ScrapeAllStocksService', () => {
  let service: ScrapeAllStocksService;
  let mockPrismaService: jest.Mocked<PrismaService>;
  let mockB3CrawlerProvider: jest.Mocked<B3CrawlerProvider>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockPrismaService = {
      company: {
        upsert: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    mockB3CrawlerProvider = {
      getStocks: jest.fn(),
    } as unknown as jest.Mocked<B3CrawlerProvider>;

    mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
      verbose: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapeAllStocksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: B3CrawlerProvider,
          useValue: mockB3CrawlerProvider,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ScrapeAllStocksService>(ScrapeAllStocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute()', () => {
    it('should fetch stocks from B3Crawler, upsert them using Prisma, log the correct messages, and return the new stocks', async () => {
      // Arrange
      const mockStocks = [{ codeCVM: '1234' }, { codeCVM: '5678' }];
      mockB3CrawlerProvider.getStocks.mockResolvedValueOnce(mockStocks);

      mockPrismaService.company.upsert.mockResolvedValueOnce(mockStocks[0] as any);
      mockPrismaService.company.upsert.mockResolvedValueOnce(mockStocks[1] as any);

      // Act
      const newStocks = await service.execute();

      // Assert
      expect(mockB3CrawlerProvider.getStocks).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.company.upsert).toHaveBeenCalledTimes(2);
      expect(mockLogger.verbose).toHaveBeenCalledWith('Processing stock {"codeCVM":"1234"}');
      expect(mockLogger.verbose).toHaveBeenCalledWith('Processing stock {"codeCVM":"5678"}');
      expect(mockLogger.verbose).toHaveBeenCalledWith('Found 2 new stocks');
      expect(newStocks).toEqual(mockStocks);
    });

    it('should skip stocks without codeCVM and log a warning', async () => {
      // Arrange
      const mockStocks = [{}, { codeCVM: '5678' }];
      mockB3CrawlerProvider.getStocks.mockResolvedValueOnce(mockStocks);

      mockPrismaService.company.upsert.mockResolvedValueOnce(mockStocks[1] as any);

      // Act
      const newStocks = await service.execute();

      // Assert
      expect(mockB3CrawlerProvider.getStocks).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.company.upsert).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith('Skipping stock due to missing codeCVM: {}');
      expect(mockLogger.verbose).toHaveBeenCalledWith('Processing stock {"codeCVM":"5678"}');
      expect(mockLogger.verbose).toHaveBeenCalledWith('Found 1 new stocks');
      expect(newStocks).toEqual([mockStocks[1]]);
    });

    it('should log an error if there`s a problem processing a stock', async () => {
      // Arrange
      const mockStocks = [{ codeCVM: '1234' }];
      mockB3CrawlerProvider.getStocks.mockResolvedValueOnce(mockStocks);

      const mockError = new Error('Test Error');
      mockPrismaService.company.upsert.mockRejectedValueOnce(mockError);

      // Act
      await service.execute();

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith('Error processing stock 1234: Test Error');
    });

    it('should throw and log an error if there`s a problem executing the service', async () => {
      // Arrange
      const mockError = new Error('Test Error');
      mockB3CrawlerProvider.getStocks.mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(service.execute()).rejects.toThrow('Test Error');
      expect(mockLogger.error).toHaveBeenCalledWith('Error in execute: Test Error');
    });
  });
});
