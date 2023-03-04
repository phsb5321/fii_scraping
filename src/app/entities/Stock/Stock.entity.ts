export interface StockI {
  codeCVM: string;
  issuingCompany: string;
  companyName: string;
  tradingName: string;
  cnpj: string;
  marketIndicator: number;
  typeBDR?: string;
  dateListing: Date;
  status: string;
  segment: string;
  segmentEng: string;
  type: number;
  market: string;
  industryClassification: string;
  industryClassificationEng: string | null;
  activity: string;
  website: string;
  hasQuotation: boolean | null;
  institutionCommon: string;
  institutionPreferred: string;
  code: string;
  otherCodes: { code: string; isin: string }[];
  hasEmissions: boolean;
  hasBDR: boolean;
  describleCategoryBVMF: string | null;
}

export class Stock implements StockI {
  constructor(stock: StockI) {
    Object.assign(this, { ...stock });
  }
  codeCVM: string;
  issuingCompany: string;
  companyName: string;
  tradingName: string;
  cnpj: string;
  marketIndicator: number;
  typeBDR?: string;
  dateListing: Date;
  status: string;
  segment: string;
  segmentEng: string;
  type: number;
  market: string;
  industryClassification: string;
  industryClassificationEng: string;
  activity: string;
  website: string;
  hasQuotation: boolean;
  institutionCommon: string;
  institutionPreferred: string;
  code: string;
  otherCodes: { code: string; isin: string }[];
  hasEmissions: boolean;
  hasBDR: boolean;
  describleCategoryBVMF: string;

  public static fromAbstract(object: { [key: string]: string }): Stock {
    const [day, month, year] = object.dateListing.split('/');
    const stock: StockI = {
      ...object,
      dateListing: new Date(+year, +month - 1, +day),
      type: Number(object.type),
      marketIndicator: Number(object.marketIndicator),
      hasQuotation: object.hasQuotation === 'true',
      hasEmissions: object.hasEmissions === 'true',
      hasBDR: object.hasBDR === 'true',
      otherCodes: JSON.parse(object.otherCodes),
    } as StockI;

    return new Stock(stock);
  }
}
