import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FiiExplorer {
  url = 'https://www.fundsexplorer.com.br';

  async makeRequest({ url }: { url: string }): Promise<cheerio.CheerioAPI> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    return cheerio.load(html);
  }

  async getFiiList(): Promise<Array<{ [key: string]: string }>> {
    const $ = await this.makeRequest({ url: `${this.url}/funds` });

    // Get the element //*[@id="fiis-list"]
    const table = $('#fiis-list');

    // Now, extract each <a/> element from the table
    const links = table.find('a');

    // Now, for each link, extract the href attribute and the text from .symbol class element
    return links
      .map((i, link) => {
        const $link = $(link);
        return {
          link: $link.attr('href') as string,
          name: $link.find('.symbol').text(),
        };
      })
      .get();
  }

  async scrapeFiiList() {
    const $ = await this.makeRequest({ url: `${this.url}/ranking` });

    // Get the element //*[@id="table-ranking"]
    const table = $('#table-ranking');

    // Now, Extract the table Headers
    const headers: Array<{ [key: string]: string }> = table
      .find('thead th')
      .map((i, th) => {
        // Replace <br/> with a space and ignore any other tag
        const $th = $(th);
        let header = $th
          .html()
          .replace(/<br\s*[\/]?>/gi, ' ')
          .replace(/<[^>]+>/g, '')
          .replace(/[\n\t]/g, '')
          .trim();

        // Replace accents with their non-accented version
        header = header.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Slugify the header
        header = header
          .toLowerCase()
          .replace(/ /g, '_')
          .replace(/-/g, '_')
          .replace(/[^a-z0-9_]/g, '');

        // Now, extract the description from the table headers by extrating the data-title from the elements with data-toggle="tooltip"
        const description = $th
          .find('[data-toggle="tooltip"]')
          .attr('data-title') as string;

        return {
          header,
          description,
        };
      })
      .get();

    // Now, Extract the table rows
    const rows = table.find('tbody tr');

    // Now, for each row, extract the text from each <td/>
    const FiiList: Array<{
      [key: string]: string;
    }> = rows
      .map((i, row) => {
        const $row = $(row);
        const tds = $row.find('td');
        // Now, for each <td/>, extract the text and sanitize it
        const fii = tds
          .map((i, td) => {
            const $td = $(td);
            const text = $td
              .text()
              .replace(/[\n\t]/g, '')
              .trim();
            return text;
          })
          .get()
          .reduce((acc, text, i) => {
            acc[headers[i].header] = text;
            return acc;
          }, {});

        // Now, convert the string to a number, except for the codigo_do_fundo and setor fields
        Object.keys(fii).forEach((key) => {
          if (key === 'codigo_do_fundo' || key === 'setor') return;
          fii[key] = transformToFloat(fii[key]);
          if (isNaN(fii[key])) fii[key] = null;
        });

        return fii;
      })
      .get();

    return FiiList;
  }
}

function transformToFloat(str) {
  if (str.endsWith('%')) {
    return parseFloat(str.slice(0, -1)) / 100;
  }
  return parseFloat(str.replace('R$', '').replace(/\./g, '').replace(',', '.'));
}
