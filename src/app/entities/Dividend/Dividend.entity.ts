/**
 * A class that implements the YahooDividendI interface.
 * Provides utility methods to create instances from abstract data.
 */
export class YahooDividendEntity {
  date?: Date;
  dividend: number;

  /**
   * Constructor for the YahooDividend class.
   * @param dividend - (Optional) Object of type YahooDividendI.
   */
  constructor(dividend?: YahooDividendEntity) {
    Object.assign(this, dividend);
  }

  /**
   * Creates an instance of YahooDividend from a generic object.
   * @param object - Abstract data object with possible date and dividend properties.
   * @returns An instance of YahooDividend.
   */
  public static fromAbstract(object: { [key: string]: any }): YahooDividendEntity {
    const [year, month, day] = object.date?.split('-') ?? [];

    // Create a UTC date using the Date.UTC() function
    const date = year ? new Date(Date.UTC(+year, +month - 1, +day)) : undefined;

    return new YahooDividendEntity({
      date,
      dividend: object.dividends,
    });
  }
}
