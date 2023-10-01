import { StockModelDB } from "@/app/models/Stock.model";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { YahooStockHistory } from "@/app/entities/YahooHistory/YahooHistory.entity";

@Entity({
  name: "yahoo_history",
})
export class YahooHistoryModelDB implements YahooStockHistory {
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
    nullable: true,
    comment: "Opening price",
    type: "decimal",
    precision: 15,
    scale: 5,
  })
  open?: number;

  @Column({
    nullable: true,
    comment: "Highest price",
    type: "decimal",
    precision: 15,
    scale: 5,
  })
  high: number;

  @Column({
    nullable: true,
    comment: "Lowest price",
    type: "decimal",
    precision: 15,
    scale: 5,
  })
  low: number;

  @Column({
    nullable: true,
    comment: "Closing price",
    type: "decimal",
    precision: 15,
    scale: 5,
  })
  close: number;

  @Column({
    nullable: true,
    comment: "Adjusted closing price",
    type: "decimal",
    precision: 15,
    scale: 5,
  })
  adjClose: number;

  @Column({
    nullable: true,
    comment: "Volume",
    type: "decimal",
    precision: 15,
    scale: 5,
  })
  volume: number;

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
