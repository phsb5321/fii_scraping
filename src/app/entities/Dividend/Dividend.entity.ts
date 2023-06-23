export interface YahooDividendI {
  date: Date;
  dividend: number;
}

export class YahooDividend implements YahooDividendI {
  date: Date;
  dividend: number;

  constructor(dividend?: YahooDividendI) {
    Object.assign(this, { ...dividend });
  }

  public static fromAbstract(object: { [key: string]: any }): YahooDividend {
    const [day, month, year] = (object.date?.split('/') ?? []);
    return new YahooDividend({
      date: year ? new Date(`${year}-${month}-${day}`) : undefined,
      dividend: object.dividend,
    });
  }
}
