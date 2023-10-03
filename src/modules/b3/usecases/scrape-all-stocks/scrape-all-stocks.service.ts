import { CompanyEntity } from '@/app/entities/Company/Company.entity';
import { PrismaService } from '@/app/infra/prisma/prisma.service';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Company } from '@prisma/client';

@Injectable()
export class ScrapeAllStocksService {
  private readonly logger = new Logger(ScrapeAllStocksService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(B3CrawlerProvider)
    private readonly b3Crawler: B3CrawlerProvider,
  ) {}

  /**
   * Entry point for the service. Fetches stocks, processes them, and returns a summary message.
   */
  async execute(): Promise<string> {
    try {
      const stocks = await this.fetchStocks();
      const newStocks = await this.processStocks(stocks);

      this.logger.verbose(`Found ${newStocks.length} new stocks`);
      return `Found ${newStocks.length} new stocks`;
    } catch (error) {
      this.logger.error(`Error in execute: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetches stocks using the B3Crawler.
   */
  private async fetchStocks(): Promise<CompanyEntity[]> {
    return this.b3Crawler.getStocks();
  }

  /**
   * Processes a list of stocks, either updating existing ones or creating new ones.
   */
  private async processStocks(stocks: CompanyEntity[]): Promise<Company[]> {
    const newStocks: Company[] = [];

    for (const stock of stocks) {
      if (!this.hasValidCodeCVM(stock)) continue;

      const upsertedStock = await this.upsertStock(stock);
      this.addNewStockToList(newStocks, upsertedStock);
    }

    return newStocks;
  }

  /**
   * Verifies that a stock has a valid codeCVM.
   */
  private hasValidCodeCVM(stock: CompanyEntity): boolean {
    if (!stock.codeCVM) {
      this.logger.warn(`Skipping stock due to missing codeCVM: ${JSON.stringify(stock)}`);
      return false;
    }
    return true;
  }

  /**
   * Inserts a new stock or updates an existing one in the database.
   */
  private async upsertStock(stock: CompanyEntity): Promise<Company> {
    try {
      return await this.prisma.company.upsert({
        where: { codeCVM: stock.codeCVM },
        create: stock as unknown as Company,
        update: stock,
      });
    } catch (error) {
      this.logger.error(`Error processing stock ${stock.codeCVM}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Adds a stock to the list if it's new.
   */
  private addNewStockToList(newStocks: Company[], stock: Company): void {
    if (!newStocks.some(existingStock => existingStock.id === stock.id)) {
      newStocks.push(stock);
    }
  }
}
