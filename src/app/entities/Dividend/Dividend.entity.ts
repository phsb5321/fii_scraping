export interface YahooDividendI {
  date: Date;
  dividends: number;
}

export class YahooDividend implements YahooDividendI {
  date: Date;
  dividends: number;

  constructor(dividends?: YahooDividendI) {
    Object.assign(this, { ...dividends });
  }

  public static fromAbstract(object: { [key: string]: any }): YahooDividend {
    const [day, month, year] = object.date?.split('/');
    return new YahooDividend({
      date: new Date(`${year}-${month}-${day}`),
      dividends: object.dividends,
    });
  }
}
