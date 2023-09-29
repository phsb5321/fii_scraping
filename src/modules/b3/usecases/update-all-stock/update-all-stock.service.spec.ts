import { Repository } from "typeorm";

import { StockModelDB } from "@/modules/b3/models/Stock.model";
import { StockCodeModelDB } from "@/modules/b3/models/StockCode.model";
import { B3CrawlerProvider } from "@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider";
import { Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { UpdateAllStockService } from "./update-all-stock.service";

describe("UpdateAllStockService", () => {
  let service: UpdateAllStockService;
  let mockStockModelRepository: jest.Mocked<Repository<StockModelDB>>;
  let mockStockCodeModelRepository: jest.Mocked<Repository<StockCodeModelDB>>;
  let mockB3CrawlerProvider: jest.Mocked<B3CrawlerProvider>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockStockModelRepository = {
      find: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<StockModelDB>>;

    mockStockCodeModelRepository = {
      upsert: jest.fn(),
    } as unknown as jest.Mocked<Repository<StockCodeModelDB>>;

    mockB3CrawlerProvider = {
      getStockDetails: jest.fn(),
    } as unknown as jest.Mocked<B3CrawlerProvider>;

    mockLogger = {
      verbose: jest.fn(),
      log: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAllStockService,
        {
          provide: getRepositoryToken(StockModelDB),
          useValue: mockStockModelRepository,
        },
        {
          provide: getRepositoryToken(StockCodeModelDB),
          useValue: mockStockCodeModelRepository,
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

    service = module.get<UpdateAllStockService>(UpdateAllStockService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("execute()", () => {
    it("should log and return an empty array when no stocks are found", async () => {
      mockStockModelRepository.find.mockResolvedValueOnce([]);
      const result = await service.execute();
      expect(mockLogger.verbose).toHaveBeenCalledWith("No stocks found");
      expect(result).toEqual([]);
    });

    it("should fetch, update and return updated stocks when stocks are found", async () => {
      const mockStocks: StockModelDB[] = [
        new StockModelDB(),
        new StockModelDB(),
      ];
      mockStockModelRepository.find.mockResolvedValueOnce(mockStocks);

      const mockStockDetails = [
        {
          /*...mock data here...*/
        },
      ];
      mockB3CrawlerProvider.getStockDetails.mockResolvedValueOnce(
        mockStockDetails
      );

      const updatedStocks: StockModelDB[] = [
        new StockModelDB(),
        new StockModelDB(),
      ];
      mockStockModelRepository.save.mockResolvedValueOnce(updatedStocks[0]);
      mockStockModelRepository.save.mockResolvedValueOnce(updatedStocks[1]);

      const result = await service.execute();

      expect(mockLogger.verbose).toHaveBeenCalledWith(
        `About to update ${mockStocks.length} stocks`
      );
      expect(mockB3CrawlerProvider.getStockDetails).toHaveBeenCalledWith(
        mockStocks.map((stock) => stock.codeCVM)
      );
      expect(mockStockModelRepository.save).toHaveBeenCalledTimes(
        mockStocks.length
      );
      expect(result).toEqual(updatedStocks);
    });
  });
});
