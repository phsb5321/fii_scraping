import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
