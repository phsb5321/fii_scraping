import { YahooQueueController } from "@/modules/yahoo/controllers/yahoo-queue-controller/yahoo-queue-controller.controller";
import { YahooService } from "@/modules/yahoo/services/yahoo.service";
import { getQueueToken } from "@nestjs/bull";
import { Test, TestingModule } from "@nestjs/testing";
import { Queue } from "bull";

describe("YahooQueueController", () => {
  let controller: YahooQueueController;
  let yahooService: YahooService;
  let yahooStocksQueue: Queue;

  beforeEach(async () => {
    yahooService = {
      updateStocks: jest.fn(),
    } as any;

    yahooStocksQueue = {
      add: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [YahooQueueController],
      providers: [
        { provide: YahooService, useValue: yahooService },
        {
          provide: getQueueToken("yahoo-stocks-queue"),
          useValue: yahooStocksQueue,
        },
      ],
    }).compile();

    controller = module.get<YahooQueueController>(YahooQueueController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("enqueueUpdateYahooStock", () => {
    it("should add a job to the queue and return a confirmation string", async () => {
      // Arrange
      const stockCode = 123;
      const expectedResponse = `Job to update stock ${stockCode} added to queue.`;

      // Act
      const response = await controller.enqueueUpdateYahooStock(stockCode);

      // Assert
      expect(yahooStocksQueue.add).toHaveBeenCalledWith("update-yahoo-stock", {
        stockCode,
      });
      expect(response).toBe(expectedResponse);
    });
  });

  describe("scheduledUpdateYahooStock", () => {
    it("should call updateStocks method of yahooService", async () => {
      // Arrange
      const stockCode = 123;

      // Act
      await controller.scheduledUpdateYahooStock(stockCode);

      // Assert
      expect(yahooService.updateStocks).toHaveBeenCalledWith(stockCode);
    });
  });
});
