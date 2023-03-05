import { Injectable } from '@nestjs/common';

import { Stock, StockI } from '@/app/entities/Stock/Stock.entity';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
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

  private async makeHttpRequest<T>(
    url: string,
    options?: Record<string, unknown>,
  ): Promise<T> {
    try {
      const { data } = await this.httpClient.get<T>(url, options);
      return data;
    } catch (error) {
      // Handle error
      throw new Error(`Error making HTTP request: ${error.message}`);
    }
  }

  private async getStocksFromPage(
    paginationOptions: QueryOptionsI, // = { language: 'pt-br', pageNumber: 1, pageSize: 100 },
    b3Option = this.b3Options.list, // = 'GetInitialCompanies/',
  ): Promise<QueryResponseI | { [key: string]: string }> {
    const paginationOptionsBase64 = Buffer.from(
      JSON.stringify(paginationOptions),
    ).toString('base64');
    const url = this.listUrl + b3Option + paginationOptionsBase64;
    const response = await this.makeHttpRequest<AxiosResponse>(url);
    return response.data as QueryResponseI | { [key: string]: string };
  }

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
        { length: firstPage.page.totalPages - 1 }, // -1 because we already have the first page
        (_, index) => index + 2, // +2 because we already have the first page
      ).map(
        async (pageNumber) =>
          await this.getStocksFromPage({
            ...paginationOptions,
            pageNumber,
          }),
      ),
    );

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

    // Now, get the details of each stock
    const stocksAndDetails = await Promise.all(
      allStocks.map(async (stock) => {
        const stockDetails = await this.getStockDetails(stock);
        return { ...stock, ...stockDetails };
      }),
    );

    // Convert the stocks to StockI
    const stocks = stocksAndDetails.map((stock) => Stock.fromAbstract(stock));

    return stocks;
  }

  public async getStockDetails(
    stock: StockI | StockI[],
  ): Promise<{ [key: string]: string }[]> {
    // If a single stock is provided, wrap it in an array
    const stocks = Array.isArray(stock) ? stock : [stock];

    // Generate the QueryParams for all stocks
    const queryParams: QueryOptionsI[] = stocks.map((s) => ({
      language: 'pt-br',
      codeCVM: s.codeCVM,
    }));

    // Get the stock details using Promise.all
    const stockDetails = await Promise.all(
      queryParams.map(
        async (queryParam) =>
          await this.getStocksFromPage(queryParam, this.b3Options.details),
      ),
    );

    // If a single stock was provided, return the first item of the result array
    if (!Array.isArray(stock))
      return [stockDetails[0]] as { [key: string]: string }[];

    // Return the stock details
    return stockDetails as { [key: string]: string }[];
  }
}
