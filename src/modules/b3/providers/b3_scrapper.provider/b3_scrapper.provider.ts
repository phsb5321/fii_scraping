import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';

import { Injectable } from '@nestjs/common';

@Injectable()
export class B3ScrapperProvider {
  constructor(
    private baseUrl = 'https://bvmf.bmfbovespa.com.br/SIG/FormConsultaHistorico.asp?strTipoResumo=HISTORICO&strSocEmissora=',
  ) { }
  private async getPageContent(
    url: string,
    debbug = false,
  ): Promise<[Page, Browser]> {
    const browser = await puppeteer.launch(debbug && { headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    const text = await page.evaluate(() => document.body.textContent);
    if (
      text.includes('Empresa Inexistente.') ||
      text.includes('Este papel não teve negociação no período selecionado')
    ) {
      await browser.close();

      throw new Error(
        'Foi encontrada alguma indicação de que a empresa não existe ou não teve negociação no período selecionado.',
      );
    }
    return [page, browser];
  }
  async getFiiHistoryList(fiiName: string, debbug = false): Promise<string[]> {
    const [page, browser] = await this.getPageContent(
      this.baseUrl + fiiName,
      debbug,
    );
    const links: string[] = [];
    const blocks = await page.evaluate(() => {
      const block = document.querySelectorAll('div[id^="id202"]');
      return Array.from(block).map((div) => div.innerHTML);
    });
    blocks.forEach((div) => {
      const $ = cheerio.load(div);
      $('a').each((i, elem) => {
        links.push($(elem).attr('href'));
      });
    });
    await browser.close();
    return [...new Set(links)];
  }
  async extractDataFromHistoryPage(
    url: string,
    debbug = false,
  ): Promise<
    Array<{
      [key: string]: string | number | Date | undefined;
    }>
  > {
    const baseUrl = 'https://bvmf.bmfbovespa.com.br/SIG/';
    const finalUrl = baseUrl + url;
    const [page, browser] = await this.getPageContent(finalUrl, debbug);
    await page
      .waitForSelector('#RES_MERCADOS', { timeout: 2 * 1000 })
      .then(() => page.click('#RES_MERCADOS'))
      .catch((err) => {
        throw new Error(err);
      });
    await page
      .waitForSelector('#MercVista', { timeout: 2 * 1000 })
      .then(() => page.click('#MercVista'))
      .catch((err) => {
        throw new Error(err);
      });
    await page.waitForSelector('#tblResDiario').catch((err) => {
      throw new Error(err);
    });
    const $ = cheerio.load(await page.content());
    const mainTable = $('table[bgcolor="#C0C0C0"]').first().find('tbody');
    mainTable.children().first().remove();
    const response: { [key: string]: string }[] = [];
    const keys = mainTable
      .find('tr')
      .first()
      .find('td')
      .map((i, elem) => {
        const $header = $(elem);
        let header = $header
          .html()
          .replace(/<br\s*\/?>/gi, '_')
          .replace(/<[^>]+>/g, '_')
          .replace(/[\n\t]/g, '_')
          .trim();
        header = header.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        header = header.replace('R$', '').replace(/[^a-z0-9_]/gi, '');
        header = header.replace(/^_+|_+$/g, '');
        header = header
          .toLowerCase()
          .replace(/ /g, '_')
          .replace(/-/g, '_')
          .replace(/[^a-z0-9_]/g, '');
        return header;
      })
      .get();
    mainTable.children().first().remove();
    mainTable.find('tr').each((i, elem) => {
      const values = $(elem)
        .find('td')
        .map((i, elem) => $(elem).text().trim())
        .get();
      const obj = keys.reduce((acc, key, i) => {
        acc[key] = values[i];
        return acc;
      }, {});
      const [month, year] = url.split('=').pop().split('-');
      obj['pregao_date'] = new Date(+year, +month - 1, +obj['dia']);
      response.push(obj);
    });
    response.pop();
    await browser.close();
    return response;
  }
  async getFiiHistory(
    fiiName: string,
    debbug = false,
  ): Promise<{
    data: { [key: string]: string | number | Date | undefined }[];
    errors: string[];
  }> {
    const links = await this.getFiiHistoryList(fiiName, debbug);
    const data: { [key: string]: string | number | Date | undefined }[] = [];
    const errors: string[] = [];
    await Promise.all(
      links.map(async (link) => {
        try {
          const response = await this.extractDataFromHistoryPage(link, debbug);
          data.push(...response);
        } catch (err) {
          errors.push(`Error on ${link}: ${err.message}`);
        }
      }),
    );
    return { data, errors };
  }
}
