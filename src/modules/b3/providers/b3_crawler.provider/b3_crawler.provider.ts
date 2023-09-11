import axios, { AxiosInstance } from 'axios';

import { Stock } from '@/app/entities/Stock/Stock.entity';
import { Injectable } from '@nestjs/common';

// Types
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

// Constants
const BASE_URL = 'https://sistemaswebb3-listados.b3.com.br/listedCompaniesProxy/CompanyCall/';
const DEFAULT_PAGINATION = {
  language: 'pt-br',
  pageNumber: 1,
  pageSize: 100,
};

@Injectable()
export class B3CrawlerProvider {
  private readonly httpClient: AxiosInstance = axios.create();
  private readonly b3Endpoints = {
    list: 'GetInitialCompanies/',
    details: 'GetDetail/',
  };

  /**
   * Builds the URL for the request.
   */
  private buildURL(endpoint: string, options: QueryOptionsI): string {
    const base64Options = Buffer.from(JSON.stringify(options)).toString('base64');
    return BASE_URL + endpoint + base64Options;
  }

  /**
   * Fetches stocks data based on provided options and endpoint.
   */
  private async fetchStocks(options: QueryOptionsI, endpoint: string): Promise<QueryResponseI> {
    const url = this.buildURL(endpoint, options);
    const { data } = await this.httpClient.get(url);
    return data;
  }

  /**
   * Fetches all the available stocks and their respective details.
   */
  public async getStocks(): Promise<Stock[]> {
    const firstPage = await this.fetchStocks(DEFAULT_PAGINATION, this.b3Endpoints.list);

    const remainingPages = await Promise.all(
      Array.from(
        { length: firstPage.page.totalPages - 1 },
        (_, index) => index + 2,
      ).map(pageNumber =>
        this.fetchStocks({ ...DEFAULT_PAGINATION, pageNumber }, this.b3Endpoints.list),
      ),
    );

    // Flatten all stock results
    const allStocks = [firstPage, ...remainingPages].flatMap(page => page.results);

    return allStocks.map(stock => Stock.fromAbstract(stock));
  }

  /**
   * Provides a method to retrieve details of a stock from B3 by its codeCVM.
   */
  public async getStockDetails(codeCVM: string | string[]): Promise<Stock[]> {
    const stocks = Array.isArray(codeCVM) ? codeCVM : [codeCVM];

    const stockDetails = await Promise.all(
      stocks.map(code =>
        this.fetchStocks({ language: 'pt-br', codeCVM: code }, this.b3Endpoints.details),
      ),
    );

    return stockDetails.map(stock => new Stock(stock as Stock));
  }
}
