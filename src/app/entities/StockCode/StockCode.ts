/**
 * Represents a stock's unique identification codes.
 * Includes both a local code and the International Securities Identification Number (ISIN).
 *
 * @example
 * const stockCode = new StockCode({ code: 'AAPL', isin: 'US0378331005' });
 * const anotherStockCode = StockCode.fromAbstract({ code: 'MSFT', isin: 'US5949181045', otherField: 'extraData' });
 */
export class StockCode {
  code: string;
  isin: string;

  /**
   * Constructs a new instance of StockCode.
   * @param stockCode - Object containing code and isin for the stock.
   */
  constructor(stockCode: Partial<StockCode>) {
    Object.assign(this, stockCode);
  }

  /**
   * Transforms abstract data into a StockCode instance.
   * Currently, it extracts only the `code` and `isin` properties.
   * This function might be useful if additional transformations are anticipated in the future.
   *
   * @param object - Abstract data containing at least the `code` and `isin` properties.
   * @returns A new instance of StockCode.
   */
  public static fromAbstract(object: { [key: string]: any }): StockCode {
    const { code, isin } = object;
    if (!code || !isin) {
      throw new Error("Required fields `code` and `isin` are missing");
    }
    return new StockCode({ code, isin });
  }
}
