export interface YahooStockHIstoryI {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;

  stockCode?: string;
}

export class YahooStockHIstory implements YahooStockHIstoryI {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;

  stockCode?: string;

  constructor(object: YahooStockHIstoryI) {
    Object.assign(this, { ...object });
  }

  static fromAbstract(object: { [key: string]: string }): YahooStockHIstory {
    const { date, stockCode, ...rest } = object;
    const [year, month, day] = date.split(/[-/]/);

    const parsedNumbers = Object.keys(rest).reduce((acc, key) => {
      acc[key] = +rest[key];
      return acc;
    }, {} as { [key: string]: number });

    return {
      ...parsedNumbers,
      date: new Date(+year, +month - 1, +day),
      stockCode,
    } as YahooStockHIstory;
  }
}
