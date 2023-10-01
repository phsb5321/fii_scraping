import { Queue } from 'bull';

import { YahooService } from '@/modules/yahoo/services/yahoo.service';
import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { YahooController } from './yahoo-controller.controller';

describe('YahooController', () => {
  let controller: YahooController;
  let yahooService: Partial<YahooService>;
  let yahooStocksQueue: Partial<Queue>;

  beforeEach(async () => {
    yahooService = {
      updateStocks: jest.fn(),
    };

    yahooStocksQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [YahooController],
      providers: [
        { provide: YahooService, useValue: yahooService },
        {
          provide: getQueueToken('yahoo-stocks-queue'),
          useValue: yahooStocksQueue,
        },
      ],
    }).compile();

    controller = module.get<YahooController>(YahooController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('enqueueUpdateYahooStock', () => {
    it('should add a job to the queue and return a confirmation string', async () => {
      // Arrange
      const stockCode = 123;
      const expectedResponse = `Job to update stock ${stockCode} added to queue.`;

      // Act
      const response = await controller.enqueueUpdateYahooStock(stockCode);

      // Assert
      expect(yahooStocksQueue.add).toHaveBeenCalledWith('update-yahoo-stock', {
        stockCode,
      });
      expect(response).toBe(expectedResponse);
    });
  });

  describe('scheduledUpdateYahooStock', () => {
    it('should call updateStocks method of yahooService', async () => {
      // Arrange
      const stockCode = 123;

      // Act
      await controller.scheduledUpdateYahooStock(stockCode);

      // Assert
      expect(yahooService.updateStocks).toHaveBeenCalledWith(stockCode);
    });
  });
});
