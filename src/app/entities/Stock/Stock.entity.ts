export interface StockI {
  codeCVM: string;
  issuingCompany: string;
  companyName: string;
  tradingName: string;
  cnpj: string;
  marketIndicator: string;
  typeBDR?: string;
  dateListing: Date;
  status: string;
  segment: string;
  segmentEng: string;
  type: number;
  market: string;
}

export class Stock implements StockI {
  codeCVM: string;
  issuingCompany: string;
  companyName: string;
  tradingName: string;
  cnpj: string;
  marketIndicator: string;
  typeBDR?: string;
  dateListing: Date;
  status: string;
  segment: string;
  segmentEng: string;
  type: number;
  market: string;

  constructor(stock: StockI) {
    this.codeCVM = stock.codeCVM;
    this.issuingCompany = stock.issuingCompany;
    this.companyName = stock.companyName;
    this.tradingName = stock.tradingName;
    this.cnpj = stock.cnpj;
    this.marketIndicator = stock.marketIndicator;
    this.typeBDR = stock.typeBDR;
    this.dateListing = stock.dateListing;
    this.status = stock.status;
    this.segment = stock.segment;
    this.segmentEng = stock.segmentEng;
    this.type = stock.type;
    this.market = stock.market;
  }

  public static fromAbstract(object: { [key: string]: string }): Stock {
    const stock: StockI = {
      ...object,
      dateListing: new Date(object.dateListing),
      type: Number(object.type),
    } as StockI;

    return new Stock(stock);
  }
}
