import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { StockCode } from "@/app/entities/StockCode/StockCode";
import { StockModelDB } from "@/app/models/Stock.model";

@Entity({
  name: "stock_code",
})
export class StockCodeModelDB implements StockCode {
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

  @Column({ comment: "Stock code" })
  code: string;

  @Column({ comment: "Stock ISIN" })
  isin: string;

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
