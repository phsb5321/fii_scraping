import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { YahooDividend } from "@/app/entities/Dividend/Dividend.entity";
import { StockModelDB } from "@/app/models/Stock.model";

@Entity({
  name: "yahoo_dividend_history",
})
export class YahooDividendHistoryModelDB implements YahooDividend {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "Unique identifier of the record",
  })
  id: number;

  @ManyToOne(() => StockModelDB, (stock) => stock, { onDelete: "CASCADE" }) // Adjust the onDelete behavior as needed
  @JoinColumn({ name: "stockId" }) // This will create a stockId column in yahoo_dividend_history table as a foreign key.
  stock: StockModelDB;

  @Column({
    type: "int",
    nullable: true, // Make it nullable or not based on your requirements
  })
  stockId: number;

  @Column({
    type: "date",
    comment: "Date of the record",
  })
  date: Date;

  @Column({
    comment: "Dividend",
    type: "decimal",
    precision: 15,
    scale: 5,
  })
  dividend: number;

  @Column({
    type: "timestamp",
    comment: "Date of creation",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "timestamp",
    comment: "Date of last update",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
