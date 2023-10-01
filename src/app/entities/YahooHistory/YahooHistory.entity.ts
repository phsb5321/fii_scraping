/**
 * A class that implements the YahooStockHistoryI interface.
 * Provides utility methods to create instances from abstract data.
 */
export class YahooStockHistory {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
  stockCode?: string;

  constructor(data: Partial<YahooStockHistory>) {
    Object.assign(this, data);
  }

  static fromAbstract(object: { [key: string]: string }): YahooStockHistory {
    const { date, stockCode, ...rest } = object;
    const [year, month, day] = date.split(/[-/]/);

    return new YahooStockHistory(
      Object.entries({ ...rest, stockCode }).reduce(
        (acc, [key, value]) => {
          if (key !== 'date') {
            acc[key] = isNaN(Number(value)) ? value : Number(value);
          }
          return acc;
        },
        {
          date: new Date(`${year}-${month}-${day}T00:00:00Z`), // Create the Date object in UTC
        } as Partial<YahooStockHistory>,
      ),
    );
  }
}
