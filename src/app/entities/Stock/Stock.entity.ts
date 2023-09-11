/**
 * Stock represents a company's stock details.
 * Includes details like company name, trading name, industry classification, etc.
 * Also provides methods to generate a stock instance from abstract data.
 */
export class Stock {
  // All properties are optional
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
  otherCodes?: { code?: string; isin?: string }[];
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
  public static fromAbstract(object: { [key: string]: any }): Stock {
    const dateParts = object.dateListing?.split('/');

    // Check if dateParts exists before destructuring
    const date = dateParts ? new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]) : undefined;

    return new Stock({
      ...object,
      dateListing: date,
      type: Number(object.type),
      marketIndicator: Number(object.marketIndicator),
    });
  }
}
