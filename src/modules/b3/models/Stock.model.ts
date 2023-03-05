import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Stock } from '@/app/entities/Stock/Stock.entity';

@Entity({
  name: 'stocks',
})
export class StockModelDB implements Stock {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique identifier of the record',
  })
  id: number;

  @Column({
    comment: 'Code CVM',
  })
  codeCVM: string;

  @Column({
    comment: 'Issuing company name',
  })
  issuingCompany: string;

  @Column({
    comment: 'Company name',
  })
  companyName: string;

  @Column({
    comment: 'Trading name',
  })
  tradingName: string;

  @Column({
    length: 14,
    comment: 'CNPJ of the company',
  })
  cnpj: string;

  @Column({
    comment: 'Market indicator',
    // type: tinyint | smallint | mediumint | int | bigint
    type: 'int',
  })
  marketIndicator: number;

  @Column({
    nullable: true,
    comment: 'Type of BDR',
  })
  typeBDR?: string;

  @Column({
    type: 'date',
    comment: 'Date of listing',
  })
  dateListing: Date;

  @Column({
    comment: 'Status of the stock',
  })
  status: string;

  @Column({
    comment: 'Segment of the stock',
  })
  segment: string;

  @Column({
    comment: 'Segment of the stock (English)',
  })
  segmentEng: string;

  @Column({
    type: 'tinyint',
    comment: 'Type of the stock',
  })
  type: number;

  @Column({
    comment: 'Market of the stock',
  })
  market: string;

  @Column({
    comment: 'Industry classification of the stock',
  })
  industryClassification: string;

  @Column({
    nullable: true,
    comment: 'Industry classification of the stock (English)',
  })
  industryClassificationEng: string;

  @Column({
    comment: 'Activity of the stock',
  })
  activity: string;

  @Column({
    nullable: true,
    comment: 'Website of the company',
  })
  website: string;

  @Column({
    nullable: true,
    comment: 'Flag indicating if the stock has quotation',
  })
  hasQuotation: boolean;

  @Column({
    comment: 'Common institution of the stock',
  })
  institutionCommon: string;

  @Column({
    nullable: true,
    comment: 'Preferred institution of the stock',
  })
  institutionPreferred: string;

  @Column({
    comment: 'Code of the stock',
  })
  code: string;

  @Column({
    type: 'simple-json',
    comment: 'Other codes of the stock',
  })
  otherCodes: { code: string; isin: string }[];

  @Column({
    comment: 'Flag indicating if the stock has emissions',
  })
  hasEmissions: boolean;

  @Column({
    comment: 'Flag indicating if the stock has BDR',
  })
  hasBDR: boolean;

  @Column({
    nullable: true,
    comment: 'Description of the category in BVMF',
  })
  describleCategoryBVMF: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: 'Timestamp when the record was created',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: 'Timestamp when the record was last updated',
  })
  updatedAt: Date;
}
