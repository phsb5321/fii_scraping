/**
 * Represents the dividend data from Yahoo.
 */
export interface YahooDividendI {
  date?: Date; // Date can be optional based on the given code.
  dividend: number;
}

/**
 * A class that implements the YahooDividendI interface.
 * Provides utility methods to create instances from abstract data.
 */
export class YahooDividend implements YahooDividendI {
  date?: Date;
  dividend: number;

  /**
   * Constructor for the YahooDividend class.
   * @param dividend - (Optional) Object of type YahooDividendI.
   */
  constructor(dividend?: YahooDividendI) {
    Object.assign(this, dividend);
  }

  /**
   * Creates an instance of YahooDividend from a generic object.
   * @param object - Abstract data object with possible date and dividend properties.
   * @returns An instance of YahooDividend.
   */
  public static fromAbstract(object: { [key: string]: any }): YahooDividend {
    const [day, month, year] = object.date?.split('/') ?? [];
    const date = year ? new Date(`${year}-${month}-${day}`) : undefined;

    return new YahooDividend({
      date,
      dividend: object.dividend,
    });
  }
}
