import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { Stock, StockI } from '@/app/entities/Stock/Stock.entity';
import { Injectable } from '@nestjs/common';

interface QueryOptionsI {
  language: string;
  pageNumber?: number;
  pageSize?: number;
  codeCVM?: string;
}

interface QueryResponseI {
  page: QueryOptionsI & {
    totalRecords: number;
    totalPages: number;
  };
  results: { [key: string]: string }[];
}

@Injectable()
export class B3CrawlerProvider {
  private readonly httpClient: AxiosInstance;

  private readonly listUrl =
    'https://sistemaswebb3-listados.b3.com.br/listedCompaniesProxy/CompanyCall/';

  private readonly b3Options = {
    list: 'GetInitialCompanies/',
    details: 'GetDetail/',
  };

  constructor() {
    this.httpClient = axios.create();
  }

  /**
   * Fetches stocks data from a specific page with the given pagination options and b3Option.
   * @param paginationOptions An object containing pagination options.
   * @param b3Option The b3 option to fetch data from.
   * @returns A promise that resolves with the queried stocks data.
   */
  private async getStocksFromPage(
    paginationOptions: QueryOptionsI,
    b3Option = this.b3Options.list,
  ): Promise<QueryResponseI | { [key: string]: string }> {
    const paginationOptionsBase64 = Buffer.from(
      JSON.stringify(paginationOptions),
    ).toString('base64');
    const url = this.listUrl + b3Option + paginationOptionsBase64;
    const { data } = await this.httpClient.get(url);
    return data;
  }

  /**
   * Fetches all the available stocks and their respective details.
   * @returns A promise that resolves with an array of stocks.
   */
  public async getStocks(): Promise<StockI[]> {
    // Generate a PaginationOptions for the first page
    const paginationOptions: QueryOptionsI = {
      language: 'pt-br',
      pageNumber: 1,
      pageSize: 100,
    };

    // Get the first page
    const firstPage: QueryResponseI = (await this.getStocksFromPage(
      paginationOptions,
    )) as QueryResponseI;

    // Get the remaining pages
    const remainingPages = await Promise.all(
      Array.from(
        { length: firstPage.page.totalPages - 1 },
        (_, index) => index + 2,
      ).map(
        async (pageNumber) =>
          await this.getStocksFromPage({
            ...paginationOptions,
            pageNumber,
          }),
      ),
    );

    // Merge the first page with the remaining pages
    const allPages = [firstPage, ...remainingPages];

    // Get all stocks from all pages
    const allStocks = allPages.reduce((accumulator, currentPage) => {
      const { results } = currentPage;
      // Verify if the current page has any stock
      if (results && results.length > 0) {
        // Merge the current page stocks with the accumulator
        return [...accumulator, ...currentPage.results];
      }
      return accumulator;
    }, []);

    // Create a Stock entity for each stock
    const stocks = allStocks.map((stock) => Stock.fromAbstract(stock));

    return stocks;
  }

  /**
   * Provides a method to retrieve details of a stock from B3 by its codeCVM.
   */
  public async getStockDetails(codeCVM: string | string[]): Promise<Stock[]> {
    // If a single stock is provided, wrap it in an array
    const stocks = Array.isArray(codeCVM) ? codeCVM : [codeCVM];

    // Generate the QueryParams for all stocks
    const queryParams: QueryOptionsI[] = stocks.map((code) => ({
      language: 'pt-br',
      codeCVM: code,
    }));

    // Get the stock details using Promise.all
    const stockDetails = await Promise.all(
      queryParams.map(
        async (queryParam) =>
          await this.getStocksFromPage(queryParam, this.b3Options.details),
      ),
    );

    // Create a Stock entity for each stock
    const stocksEntities = stockDetails.map(
      (stock) => new Stock(stock as StockI),
    );

    return stocksEntities;
  }
}
