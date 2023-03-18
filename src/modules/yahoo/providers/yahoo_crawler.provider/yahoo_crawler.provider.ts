import axios from 'axios';

import {
  YahooStockHIstoryI,
  YahooStockHIstory,
} from '@/app/entities/YahooHistory/YahooHistory.entity';

import {
  YahooDividend,
  YahooDividendI,
} from '@/app/entities/Dividend/Dividend.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class YahooCrawlerProvider {
  baseUrl = 'https://query1.finance.yahoo.com/v7/finance/download/';
  historyConfigs: string;
  dividendConfigs: string;

  constructor() {
    this.historyConfigs = `?period1=0&period2=${new Date()}&interval=1d&events=history&includeAdjustedClose=true`;
    this.dividendConfigs = `?period1=0&period2=${new Date()}&interval=1d&events=div&includeAdjustedClose=true`;
  }

  async getStockTradeHistory(stockCode: string): Promise<YahooStockHIstoryI[]> {
    const { data } = await axios
      .get(`${this.baseUrl}${stockCode}${this.historyConfigs}`)
      .catch((error) => {
        throw new Error(
          `${error.message} - Stock Code: ${stockCode} - URL: ${this.baseUrl}${stockCode}${this.historyConfigs}`,
        );
      });

    // Parse data to JSON
    const parsedData = this.parseCSV(data);

    // Now, format the Date key to a Date object
    const formattedData: YahooStockHIstoryI[] = parsedData.map((item) => {
      return YahooStockHIstory.fromAbstract(item);
    });

    return formattedData;
  }

  async getStockdividend(stockCode: string): Promise<YahooDividendI[]> {
    const { data } = await axios
      .get(`${this.baseUrl}${stockCode}${this.dividendConfigs}`)
      .catch((error) => {
        throw new Error(
          `${error.message} - Stock Code: ${stockCode} - URL: ${this.baseUrl}${stockCode}${this.dividendConfigs}`,
        );
      });

    // Parse data to JSON
    const parsedData = this.parseCSV(data);

    // Now, format the Date key to a Date object
    const formattedData: YahooDividendI[] = parsedData.map((item) => {
      return YahooDividend.fromAbstract(item);
    });

    return formattedData;
  }

  private parseCSV(data: string): { [key: string]: string }[] {
    // Split the data by new line
    const lines = data.split('\n');

    // Get the headers
    const headers = lines[0].split(',');

    // Make the headers camelCase
    headers.forEach((header, index) => {
      headers[index] = header
        .split(' ')
        .map((word, index) => {
          if (index === 0) return word.toLowerCase();
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
    });

    // For each line, create an object with the headers as keys
    const result = lines.slice(1).map((line) => {
      const obj = {};
      const currentline = line.split(',');

      headers.forEach((header, index) => {
        obj[header] = currentline[index];
      });

      return obj;
    });

    return result;
  }
}
