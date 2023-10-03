/**
 * A class that implements the YahooStockHistoryI interface.
 * Provides utility methods to create instances from abstract data.
 */
export class YahooStockHistoryEntity {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
  stockCode?: string;

  constructor(data: Partial<YahooStockHistoryEntity>) {
    Object.assign(this, data);
  }

  /**
   * Creates an instance of YahooStockHistory from a generic object.
   * @param object - Abstract data object.
   * @returns An instance of YahooStockHistory.
   */
  public static fromAbstract(object: { [key: string]: any }): YahooStockHistoryEntity {
    const [year, month, day] = object.date?.split('-') ?? [];

    // Create a UTC date using the Date.UTC() function
    const date = year ? new Date(Date.UTC(+year, +month - 1, +day)) : undefined;

    return new YahooStockHistoryEntity({
      ...object,
      date: date,
    });
  }
}
