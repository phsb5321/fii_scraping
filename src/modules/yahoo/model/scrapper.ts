import { CheerioProvider } from '@/app/infra/cheerio-provider/cheerio-provider';
import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';

export class YahooHistory {
  constructor(
    private readonly cheerioProvider: CheerioProvider,
    private baseUrl = 'https://br.financas.yahoo.com/quote/',
  ) {}
}
