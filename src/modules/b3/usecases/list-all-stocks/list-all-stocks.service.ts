import { Repository } from "typeorm";

import { StockModelDB } from "@/modules/b3/models/Stock.model";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/**
 * ListAllStocksService is a service responsible for fetching all stock data from the database.
 * It uses the StockModelDB repository to get the list of stocks.
 * The results are then logged and returned.
 */
@Injectable()
export class ListAllStocksService {
  private readonly logger = new Logger(ListAllStocksService.name);

  /**
   * Creates an instance of the ListAllStocksService.
   * @param {Repository<StockModelDB>} stockModelRepository - The repository for StockModelDB, used for database operations.
   */
  constructor(
    @InjectRepository(StockModelDB)
    private readonly stockModelRepository: Repository<StockModelDB>
  ) {}

  /**
   * Fetches and returns all stocks from the database.
   * @returns {Promise<StockModelDB[]>} The list of all stocks.
   */
  async execute(): Promise<StockModelDB[]> {
    const stocks = await this.stockModelRepository.find();
    this.logger.verbose(`Found ${stocks.length} stocks`);
    return stocks;
  }
}
