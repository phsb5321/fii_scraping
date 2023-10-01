/**
 * Represents other codes related to a stock, such as ISIN.
 */
export type OtherCode = {
  code?: string;
  isin?: string;
};

/**
 * Stock represents a company's stock details.
 * Includes details like company name, trading name, industry classification, etc.
 * Also provides methods to generate a stock instance from abstract data.
 */
export class Stock {
  codeCVM?: string;
  issuingCompany?: string;
  companyName?: string;
  tradingName?: string;
  cnpj?: string;
  marketIndicator?: number;
  typeBDR?: string;
  dateListing?: Date;
  status?: string;
  segment?: string;
  segmentEng?: string;
  type?: number;
  market?: string;
  industryClassification?: string;
  industryClassificationEng?: string | null;
  activity?: string;
  website?: string;
  hasQuotation?: boolean;
  institutionCommon?: string;
  institutionPreferred?: string;
  code?: string;
  otherCodes?: OtherCode[];
  hasEmissions?: boolean;
  hasBDR?: boolean;
  describleCategoryBVMF?: string | null;

  constructor(stock?: Partial<Stock>) {
    Object.assign(this, stock);
  }

  /**
   * Creates an instance of Stock from abstract data.
   * It primarily converts date strings into Date objects and strings to numbers where needed.
   * @param object - Abstract data object to be transformed to Stock.
   */
  public static fromAbstract(object: Record<string, any>): Stock {
    const date = this.parseDate(object.dateListing);
    return new Stock({
      ...object,
      dateListing: date,
      type: Number(object.type),
      marketIndicator: Number(object.marketIndicator),
    });
  }

  private static parseDate(dateString?: string): Date | undefined {
    if (!dateString) return;

    const [day, month, year] = dateString.split('/');
    return new Date(Date.UTC(+year, +month - 1, +day)); // Use UTC time
  }
}
