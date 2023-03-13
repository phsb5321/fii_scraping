interface StockCodeI {
  code: string;
  isin: string;
}

export class StockCode implements StockCodeI {
  code: string;
  isin: string;

  constructor(stockCode?: StockCodeI) {
    Object.assign(this, { ...stockCode });
  }

  public static fromAbstract(object: { [key: string]: any }): StockCode {
    const { code, isin } = object as StockCodeI;
    return new StockCode({ code, isin });
  }
}
