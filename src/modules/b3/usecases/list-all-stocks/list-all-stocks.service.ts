// src/modules/b3/usecases/list-all-stocks/list-all-stocks.service.ts

import { Repository, FindManyOptions } from 'typeorm';

import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ListAllStocksService {
  private readonly logger = new Logger(ListAllStocksService.name);

  constructor(
    // Inject the stock model repository for database operations
    @InjectRepository(StockModelDB)
    private stockModelRepository: Repository<StockModelDB>,
  ) { }

  async execute(): Promise<StockModelDB[]> {
    // Fetch the list of stocks from the database
    const stocks = await this.stockModelRepository.find();

    // Log the number of stocks fetched from the database
    this.logger.verbose(`Found ${stocks.length} stocks`);

    // Return the list of stocks fetched from the database
    return stocks;
  }
}
