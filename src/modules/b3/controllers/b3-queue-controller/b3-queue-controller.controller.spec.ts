import Bottleneck from 'bottleneck';
import { Queue } from 'bull';

import {
  B3QueueController
} from '@/modules/b3/controllers/b3-queue-controller/b3-queue-controller.controller';
import { B3Service } from '@/modules/b3/services/b3.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('B3QueueController', () => {
  let controller: B3QueueController;
  let b3Service: B3Service;
  let stocksQueue: Queue;
  let limiter: Bottleneck;

  // Mock implementations
  const mockB3Service = {
    scrapeAllStocks: jest.fn(),
    scrapeAllStocksDetails: jest.fn(),
  };
  const mockQueue = {
    add: jest.fn(),
  };
  const mockLimiter = {
    schedule: jest.fn(fn => fn()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [B3QueueController],
      providers: [
        { provide: B3Service, useValue: mockB3Service },
        { provide: 'bull.QUEUE_NAME', useValue: mockQueue },  // Replace 'QUEUE_NAME' with appropriate queue token
        Bottleneck,
      ],
    }).compile();

    controller = module.get<B3QueueController>(B3QueueController);
    b3Service = module.get<B3Service>(B3Service);
    stocksQueue = module.get<Queue>('bull.stocks-queue'); // Getting the queue with the prefixed token
    limiter = module.get<Bottleneck>(Bottleneck);

    jest.spyOn(limiter, 'schedule').mockImplementation(mockLimiter.schedule);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('enqueueScrapeAllStocks', () => {
    it('should enqueue a scrape-all-stocks task', async () => {
      const result = await controller.enqueueScrapeAllStocks();

      expect(stocksQueue.add).toHaveBeenCalledWith('scrape-all-stocks', {});
      expect(result).toBe('scrape all stocks Job Added to Queue!');
    });
  });

  describe('enqueueScrapeAllStocksDetails', () => {
    it('should enqueue a scrape-all-stocks-details task', async () => {
      const result = await controller.enqueueScrapeAllStocksDetails();

      expect(stocksQueue.add).toHaveBeenCalledWith('scrape-all-stocks-details', {});
      expect(result).toBe('scrape all stocks details Job Added to Queue!');
    });
  });

  describe('scheduledScrapeAllStocks', () => {
    it('should call the B3Service method to scrape all stocks', async () => {
      await controller.scheduledScrapeAllStocks();

      expect(b3Service.scrapeAllStocks).toHaveBeenCalled();
    });
  });

  describe('scheduledScrapeAllStocksDetails', () => {
    it('should call the B3Service method to scrape all stock details', async () => {
      await controller.scheduledScrapeAllStocksDetails();

      expect(b3Service.scrapeAllStocksDetails).toHaveBeenCalled();
    });
  });
});
