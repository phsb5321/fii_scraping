import axios from "axios";

import {
  YahooDividend,
  YahooDividendI,
} from "@/app/entities/Dividend/Dividend.entity";
import { YahooStockHistory } from "@/app/entities/YahooHistory/YahooHistory.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class YahooCrawlerProvider {
  private readonly baseUrl =
    "https://query1.finance.yahoo.com/v7/finance/download/";
  private readonly historyConfigs = `?period1=0&period2=${Date.now()}&interval=1d&events=history&includeAdjustedClose=true`;
  private readonly dividendConfigs = `?period1=0&period2=${Date.now()}&interval=1d&events=div&includeAdjustedClose=true`;

  /**
   * Fetch stock trade history for a given stock code.
   *
   * @param stockCode - The stock code to fetch history for.
   * @returns - The stock history.
   */
  async getStockTradeHistory(stockCode: string): Promise<YahooStockHistory[]> {
    return this.fetchData(
      stockCode,
      this.historyConfigs,
      YahooStockHistory.fromAbstract
    );
  }

  /**
   * Fetch stock dividend for a given stock code.
   *
   * @param stockCode - The stock code to fetch dividends for.
   * @returns - The stock dividends.
   */
  async getStockdividend(stockCode: string): Promise<YahooDividendI[]> {
    return this.fetchData(
      stockCode,
      this.dividendConfigs,
      YahooDividend.fromAbstract
    );
  }

  /**
   * Core method to fetch data and parse it.
   *
   * @param stockCode - The stock code to fetch data for.
   * @param config - The configurations for the fetching (either history or dividends).
   * @param transform - The transformation function.
   * @returns - Transformed data.
   */
  private async fetchData(
    stockCode: string,
    config: string,
    transform: (data: any) => any
  ): Promise<any[]> {
    const url = `${this.baseUrl}${stockCode}${config}`;

    const { data } = await axios.get(url).catch((error) => {
      throw new Error(
        `${error.message} - Stock Code: ${stockCode} - URL: ${url}`
      );
    });

    const parsedData = this.parseCSV(data);
    return parsedData.map(transform);
  }

  /**
   * Parse CSV data into JSON format.
   *
   * @param data - CSV formatted string.
   * @returns - Array of objects representing each line of the CSV.
   */
  private parseCSV(data: string): { [key: string]: string }[] {
    const lines = data.split("\n");
    const headers = lines[0].split(",").map(this.toCamelCase);

    return lines.slice(1).map((line) => {
      return line.split(",").reduce((obj, value, index) => {
        obj[headers[index]] = value;
        return obj;
      }, {});
    });
  }

  /**
   * Convert a string to camelCase.
   *
   * @param str - The string to convert.
   * @returns - The camelCased string.
   */
  private toCamelCase(str: string): string {
    return str
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
  }
}
