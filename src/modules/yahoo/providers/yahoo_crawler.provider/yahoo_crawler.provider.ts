import axios from 'axios';

import { Injectable } from '@nestjs/common';

export interface StockYahooI {
  // Make the headers camelCase
  date: Date;
  open: string;
  high: string;
  low: string;
  close: string;
  adjClose: string;
  volume: string;
}

@Injectable()
export class YahooCrawlerProvider {
  baseUrl = 'https://query1.finance.yahoo.com/v7/finance/download/';
  defaultConfigs =
    'period1=1646427000&period2=1677963000&interval=1d&events=history&includeAdjustedClose=true';

  async getStock(stockCode: string): Promise<StockYahooI[]> {
    const { data } = await axios.get(
      `${this.baseUrl}${stockCode}?${this.defaultConfigs}`,
    );

    // Parse data to JSON
    const parsedData = this.parseCSV(data);

    // Now, format the Date key to a Date object
    const formattedData: StockYahooI[] = parsedData.map((item) => {
      const [year, month, day] = item.date.split(/[-/]/);
      const yahooStock: StockYahooI = {
        ...item,
        date: new Date(+year, +month - 1, +day),
      } as StockYahooI;
      return yahooStock;
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
