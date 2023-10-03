type CompanyKeys = keyof CompanyEntity;

export class CompanyEntity {
  codeCVM?: string;
  issuingCompany?: string;
  companyName?: string;
  tradingName?: string;
  cnpj?: string;
  website?: string;
  segment?: string;
  segmentEng?: string;
  industryClassification?: string;
  industryClassificationEng?: string | null;
  activity?: string;

  constructor(data: Record<string, any>) {
    const filteredData = this.fromAbstract(data);
    Object.assign(this, filteredData);
  }

  private fromAbstract(data: Record<string, any>): Partial<CompanyEntity> {
    const allowedKeys: CompanyKeys[] = [
      'codeCVM',
      'issuingCompany',
      'companyName',
      'tradingName',
      'cnpj',
      'website',
      'segment',
      'segmentEng',
      'industryClassification',
      'industryClassificationEng',
      'activity',
    ];
    const filtered = {} as Partial<CompanyEntity>;

    for (const key of allowedKeys) {
      if (data[key] !== undefined) {
        filtered[key] = data[key];
      }
    }

    return filtered;
  }
}
