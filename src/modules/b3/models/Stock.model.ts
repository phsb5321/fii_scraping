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
    length: 10,
    comment: 'Code CVM',
  })
  codeCVM: string;

  @Column({
    length: 100,
    comment: 'Issuing company name',
  })
  issuingCompany: string;

  @Column({
    length: 100,
    comment: 'Company name',
  })
  companyName: string;

  @Column({
    length: 100,
    comment: 'Trading name',
  })
  tradingName: string;

  @Column({
    length: 14,
    comment: 'CNPJ of the company',
  })
  cnpj: string;

  @Column({
    length: 3,
    comment: 'Market indicator',
  })
  marketIndicator: string;

  @Column({
    nullable: true,
    length: 30,
    comment: 'Type of BDR',
  })
  typeBDR?: string;

  @Column({
    type: 'date',
    comment: 'Date of listing',
  })
  dateListing: Date;

  @Column({
    length: 20,
    comment: 'Status of the stock',
  })
  status: string;

  @Column({
    length: 30,
    comment: 'Segment of the stock',
  })
  segment: string;

  @Column({
    length: 30,
    comment: 'Segment of the stock (English)',
  })
  segmentEng: string;

  @Column({
    type: 'tinyint',
    comment: 'Type of the stock',
  })
  type: number;

  @Column({
    length: 10,
    comment: 'Market of the stock',
  })
  market: string;
}
