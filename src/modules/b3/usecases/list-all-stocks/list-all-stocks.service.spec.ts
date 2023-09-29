import { Repository } from "typeorm";

import { StockModelDB } from "@/modules/b3/models/Stock.model";
import { ListAllStocksService } from "@/modules/b3/usecases/list-all-stocks/list-all-stocks.service";
import { Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ListAllStocksService", () => {
  let service: ListAllStocksService;
  let mockRepository: Partial<jest.Mocked<Repository<StockModelDB>>>;
  let mockLogger: Partial<jest.Mocked<Logger>>;

  beforeEach(async () => {
    // Mock the Repository and Logger with type safety
    mockRepository = {
      find: jest.fn(),
    };

    mockLogger = {
      verbose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAllStocksService,
        {
          provide: getRepositoryToken(StockModelDB),
          useValue: mockRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ListAllStocksService>(ListAllStocksService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("execute()", () => {
    it("should call the repository's find method, log the correct message and return the stocks", async () => {
      // Arrange
      const mockStocks: StockModelDB[] = [
        new StockModelDB(),
        new StockModelDB(),
      ];
      mockRepository.find.mockResolvedValueOnce(mockStocks);

      // Act
      const stocks = await service.execute();

      // Assert
      expect(mockRepository.find).toHaveBeenCalledTimes(1); // Check if the repository's find method was called once
      expect(mockLogger.verbose).toHaveBeenCalledWith(
        `Found ${mockStocks.length} stocks`
      ); // Check if the logger.verbose method was called with the expected argument
      expect(stocks).toEqual(mockStocks); // Check if the returned stocks are the same as the mock stocks
    });

    it("should handle when find method throws an error", async () => {
      // Arrange
      mockRepository.find.mockRejectedValueOnce(new Error("Some Error"));

      // Act and Assert
      await expect(service.execute()).rejects.toThrow("Some Error"); // Check if the execute method rejects with the expected error
    });
  });
});
