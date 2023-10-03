export type OtherCode = {
  code?: string;
  isin?: string;
};

type StockKeys = keyof StockEntity;

export class StockEntity {
  id?: number;
  companyId?: number;
  codeCVM?: string;
  marketIndicator?: number;
  typeBDR?: string;
  dateListing?: Date;
  status?: string;
  type?: number;
  market?: string;
  hasQuotation?: boolean;
  institutionCommon?: string;
  institutionPreferred?: string;
  code?: string;
  hasEmissions?: boolean;
  hasBDR?: boolean;
  describleCategoryBVMF?: string | null;
  createdAt?: Date;
  updatedAt?: Date;

  // Additional fields
  otherCodes?: OtherCode[];

  constructor(stock?: Partial<StockEntity>) {
    Object.assign(this, stock);
  }

  public static fromAbstract(object: Record<string, any>): Partial<StockEntity> {
    const date = this.parseDate(object.dateListing);
    const filteredData = this.filterAllowedKeys(object);
    return {
      ...filteredData,
      dateListing: date,
      type: Number(object.type),
      marketIndicator: Number(object.marketIndicator),
    };
  }

  private static filterAllowedKeys(data: Record<string, any>): Partial<StockEntity> {
    const allowedKeys: StockKeys[] = [
      'id',
      'companyId',
      'codeCVM',
      'marketIndicator',
      'typeBDR',
      'dateListing',
      'status',
      'type',
      'market',
      'hasQuotation',
      'institutionCommon',
      'institutionPreferred',
      'code',
      'hasEmissions',
      'hasBDR',
      'describleCategoryBVMF',
      'createdAt',
      'updatedAt',
      'otherCodes',
    ];
    const filtered: Record<string, any> = {};

    for (const key of allowedKeys) {
      if (data[key] !== undefined) {
        filtered[key] = data[key];
      }
    }

    return filtered as Partial<StockEntity>;
  }

  private static parseDate(dateString?: string): Date | undefined {
    if (!dateString) return;

    const [day, month, year] = dateString.split('/');
    return new Date(Date.UTC(+year, +month - 1, +day)); // Use UTC time
  }
}
