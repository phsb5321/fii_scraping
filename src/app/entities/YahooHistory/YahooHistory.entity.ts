/**
 * Represents the historical stock data sourced from Yahoo Finance.
 * This data includes trading details like the opening price, closing price,
 * highest price during the day, lowest price during the day, adjusted close price, and volume.
 * 
 * @example
 * const YahooStockHistory = new YahooStockHistory({ date: new Date(), open: 150, high: 155, low: 145, close: 154, adjClose: 154, volume: 100000 });
 * const anotherYahooStockHistory = YahooStockHistory.fromAbstract({ date: '2023-09-08', open: '150', high: '155', low: '145', close: '154', adjClose: '154', volume: '100000' });
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

  /**
   * Constructs a new instance of YahooStockHistory.
   * @param data - Object containing all the necessary details about the stock's historical data.
   */
  constructor(data: Partial<YahooStockHistory>) {
    Object.assign(this, data);
  }

  /**
   * Transforms abstract data into a YahooStockHistory instance.
   * Useful for parsing strings and converting them to the appropriate types.
   * 
   * @param object - Abstract data in string format.
   * @returns A new instance of YahooStockHistory.
   */
  static fromAbstract(object: { [key: string]: string }): YahooStockHistory {
    const { date, stockCode, ...rest } = object;
    const [year, month, day] = date.split(/[-/]/);

    const parsedData = {
      ...rest,
      date: new Date(+year, +month - 1, +day),
      stockCode
    };

    return new YahooStockHistory(Object.entries(parsedData).reduce((acc, [key, value]) => {
      acc[key] = isNaN(Number(value)) ? value : Number(value);
      return acc;
    }, {} as any));
  }
}
