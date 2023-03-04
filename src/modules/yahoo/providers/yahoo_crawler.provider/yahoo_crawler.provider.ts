import { Stock, StockI } from '@/app/entities/Stock/Stock.entity';
import { Injectable } from '@nestjs/common';

import fetch from 'node-fetch';

@Injectable()
export class YahooCrawlerProvider {
  baseUrl = 'https://query1.finance.yahoo.com/v7/finance/download/';
  defaultConfigs =
    'period1=1646427000&period2=1677963000&interval=1d&events=history&includeAdjustedClose=true';

  async getStock(stockCode: string) {
    const stockHistory = await fetch(
      `${this.baseUrl}${stockCode}?${this.defaultConfigs}`,
    );
    return stockHistory;
  }
}
