import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';

export class B3History {
  constructor(
    private baseUrl = 'https://bvmf.bmfbovespa.com.br/SIG/FormConsultaHistorico.asp?strTipoResumo=HISTORICO&strSocEmissora=', // URL to the B3 History page
  ) { }

  async getPageContent(url: string, debbug = false): Promise<[Page, Browser]> {
    // Launch the Puppeteer browser
    const browser = await puppeteer.launch(
      debbug && {
        headless: false, // don't run the browser in headless mode, show UI
        // slowMo: 100, // slow down by 250ms
        // devtools: false, // open devtools when launched
      },
    );

    // Open a new page in the browser and go to the URL
    const page = await browser.newPage();
    await page.goto(url);

    // If page contains text "Empresa inexistente", throw an error
    const text = await page.evaluate(() => document.body.textContent);
    if (
      text.includes('Empresa Inexistente.') ||
      text.includes('Este papel não teve negociação no período selecionado')
    ) {
      await browser.close();
      // Throw an descriptive error
      throw new Error(
        'Foi encontrada alguma indicação de que a empresa não existe ou não teve negociação no período selecionado.',
      );
    }

    return [page, browser];
  }
  async getFiiHistoryList(fiiName: String, debbug = false): Promise<String[]> {
    // Launch the Puppeteer browser
    const [page, browser] = await this.getPageContent(
      this.baseUrl + fiiName,
      debbug,
    );

    const links: String[] = []; // Array to store the links

    // Evaluate the page and extract all <div/> elements with the //*[id^="id202"]
    const blocks = await page.evaluate(() => {
      const block = document.querySelectorAll('div[id^="id202"]');
      return Array.from(block).map((div) => div.innerHTML);
    });

    // For each div, extract all href links
    blocks.forEach((div) => {
      const $ = cheerio.load(div);
      $('a').each((i, elem) => {
        links.push($(elem).attr('href'));
      });
    });

    await browser.close();
    return [...new Set(links)];
  }

  // Should return an array of objects or an error
  async extractDataFromHistoryPage(
    url: String,
    debbug = false,
  ): Promise<Object[]> {
    // Build the final URL
    const baseUrl = 'https://bvmf.bmfbovespa.com.br/SIG/';
    const finalUrl = baseUrl + url;

    // Launch the Puppeteer browser
    const [page, browser] = await this.getPageContent(finalUrl, debbug);

    // Await for the page to load and click on the <a/> element with //*[@id="RES_MERCADOS"]
    await page
      .waitForSelector('#RES_MERCADOS', { timeout: 2 * 1000 }) // Waits for 5 seconds
      .then(() => page.click('#RES_MERCADOS'))
      .catch((err) => {
        throw new Error(err);
      });

    // Await for the page to load and click on the <a/> element with //*[@id="MercVista"]
    await page
      .waitForSelector('#MercVista', { timeout: 2 * 1000 }) // Waits for 5 seconds
      .then(() => page.click('#MercVista'))
      .catch((err) => {
        throw new Error(err);
      });

    // Await for the page to load the element with //*[@id="tblResDiario"]
    await page.waitForSelector('#tblResDiario').catch((err) => {
      throw new Error(err);
    });

    // Parse the HTML content with Cheerio
    const $ = cheerio.load(await page.content());

    // Find the first table bgcolor="#C0C0C0"
    const mainTable = $('table[bgcolor="#C0C0C0"]').first().find('tbody');

    // Remove the first child from the parent (an empty <td/>)
    mainTable.children().first().remove();

    const response: { [key: string]: String }[] = [];

    // Use the first table row as the keys
    const keys = mainTable
      .find('tr')
      .first()
      .find('td')
      .map((i, elem) => {
        const $header = $(elem);
        let header = $header
          .html()
          .replace(/<br\s*[\/]?>/gi, '_') // Replace <br> with space
          .replace(/<[^>]+>/g, '_') // Remove any HTML tag
          .replace(/[\n\t]/g, '_') // Remove any new line or tab
          .trim();

        // Replace accents with their non-accented version
        header = header.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Remove any character that is not a letter, number or underscore
        header = header.replace('R$', '').replace(/[^a-z0-9_]/gi, '');

        // Remove any trailing or leading underscore
        header = header.replace(/^_+|_+$/g, '');

        // Slugify the header
        header = header
          .toLowerCase()
          .replace(/ /g, '_')
          .replace(/-/g, '_')
          .replace(/[^a-z0-9_]/g, '');

        return header;
      })
      .get();

    // Remove the first child from the parent (the keys)
    mainTable.children().first().remove();

    // For each table row, extract the data
    mainTable.find('tr').each((i, elem) => {
      const values = $(elem)
        .find('td')
        .map((i, elem) => $(elem).text().trim())
        .get();

      // Create an object with the keys and values
      const obj = keys.reduce((acc, key, i) => {
        acc[key] = values[i];
        return acc;
      }, {});

      response.push(obj);
    });

    // Remove last element of the array (empty object)
    response.pop();

    await browser.close();
    return response;
  }
}
