import { EventConfigs } from "@/app/utils/EventConfigs";
import { ExtractStockHistoryService } from "@/modules/yahoo/usecases/extract-stock-history/extract-stock-history.service";
import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class YahooService {
  private readonly logger = new Logger(YahooService.name);

  constructor(
    private readonly extractStockHistoryService: ExtractStockHistoryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(EventConfigs.UPDATE_YAHOO_STOCK)
  async handleUpdateMultipleStocks(): Promise<void> {
    this.logger.verbose("Received event to update multiple stocks");

    try {
      const stocks = await this.extractStockHistoryService.execute();
      if (!stocks.length) {
        this.logger.warn("No stocks found");
        return;
      }

      this.logger.verbose(`Successfully updated ${stocks.length} stocks`);
      this.eventEmitter.emit("updatedMultipleYahooStocks", stocks);
    } catch (error) {
      this.logger.error("Error updating stocks", error.stack);
      this.eventEmitter.emit(
        "updateMultipleYahooStocks.failure",
        error.message,
      );
    }
  }
}
