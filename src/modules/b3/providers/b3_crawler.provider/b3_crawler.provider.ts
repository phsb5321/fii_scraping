import { Injectable } from '@nestjs/common';

import { Stock, StockI } from '@/app/entities/Stock/Stock.entity';
import axios from 'axios';

interface PaginationOptionsI {
  language: string;
  pageNumber: number;
  pageSize: number;
}

interface QueryResponseI {
  page: PaginationOptionsI & {
    totalRecords: number;
    totalPages: number;
  };
  results: { [key: string]: string }[];
}

@Injectable()
export class B3CrawlerProvider {
  constructor(
    private readonly baseUrl: string = 'https://sistemaswebb3-listados.b3.com.br/listedCompaniesProxy/CompanyCall/GetInitialCompanies/',
    private readonly httpClient = axios,
  ) {}

  private async getStocksFromPage(
    paginationOptions: PaginationOptionsI,
  ): Promise<QueryResponseI> {
    // Generate a base64 of the paginationOptions
    const paginationOptionsBase64 = Buffer.from(
      JSON.stringify(paginationOptions),
    ).toString('base64');

    // Make the request
    return this.httpClient
      .get<QueryResponseI>(this.baseUrl + paginationOptionsBase64)
      .then((response) => response.data);
  }

  public async getStocks(): Promise<StockI[]> {
    // Generate a PaginationOptions for the first page
    const paginationOptions: PaginationOptionsI = {
      language: 'pt-br',
      pageNumber: 1,
      pageSize: 100,
    };

    // Get the first page
    const firstPage = await this.getStocksFromPage(paginationOptions);

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

    // Convert the stocks to StockI
    const stocks = allStocks.map((stock) => Stock.fromAbstract(stock));

    return stocks;
  }
}
