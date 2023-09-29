import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Stock } from "@/app/entities/Stock/Stock.entity";

@Entity({
  name: "stocks",
})
export class StockModelDB implements Stock {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "Unique identifier of the record",
  })
  id: number;

  @Column({
    comment: "Code CVM",
    nullable: true,
  })
  codeCVM: string;

  @Column({
    comment: "Issuing company name",
    nullable: true,
  })
  issuingCompany: string;

  @Column({
    comment: "Company name",
    nullable: true,
  })
  companyName: string;

  @Column({
    comment: "Trading name",
    nullable: true,
  })
  tradingName: string;

  @Column({
    comment: "CNPJ of the company",
    nullable: true,
    length: 14,
  })
  cnpj: string;

  @Column({
    comment: "Market indicator",
    nullable: true,
    // type: tinyint | smallint | mediumint | int | bigint
    type: "int",
  })
  marketIndicator: number;

  @Column({
    comment: "Type of BDR",
    nullable: true,
  })
  typeBDR?: string;

  @Column({
    comment: "Date of listing",
    nullable: true,
    type: "date",
  })
  dateListing: Date;

  @Column({
    comment: "Status of the stock",
    nullable: true,
  })
  status: string;

  @Column({
    comment: "Segment of the stock",
    nullable: true,
  })
  segment: string;

  @Column({
    comment: "Segment of the stock (English)",
    nullable: true,
  })
  segmentEng: string;

  @Column({
    comment: "Type of the stock",
    nullable: true,
    type: "tinyint",
  })
  type: number;

  @Column({
    comment: "Market of the stock",
    nullable: true,
  })
  market: string;

  @Column({
    comment: "Industry classification of the stock",
    nullable: true,
  })
  industryClassification: string;

  @Column({
    comment: "Industry classification of the stock (English)",
    nullable: true,
  })
  industryClassificationEng: string;

  @Column({
    comment: "Activity of the stock",
    nullable: true,
  })
  activity: string;

  @Column({
    comment: "Website of the company",
    nullable: true,
  })
  website: string;

  @Column({
    comment: "Flag indicating if the stock has quotation",
    nullable: true,
  })
  hasQuotation: boolean;

  @Column({
    comment: "Common institution of the stock",
    nullable: true,
  })
  institutionCommon: string;

  @Column({
    comment: "Preferred institution of the stock",
    nullable: true,
  })
  institutionPreferred: string;

  @Column({
    comment: "Code of the stock",
    nullable: true,
  })
  code: string;

  @Column({
    comment: "Flag indicating if the stock has emissions",
    nullable: true,
  })
  hasEmissions: boolean;

  @Column({
    comment: "Flag indicating if the stock has BDR",
    nullable: true,
  })
  hasBDR: boolean;

  @Column({
    comment: "Description of the category in BVMF",
    nullable: true,
  })
  describleCategoryBVMF: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    comment: "Timestamp when the record was created",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
    comment: "Timestamp when the record was last updated",
  })
  updatedAt: Date;
}
