import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { StockModelDB } from "@/modules/b3/models/Stock.model";
import { StockCode } from "@/app/entities/StockCode/StockCode";

@Entity({
  name: "stock_code",
})
export class StockCodeModelDB implements StockCode {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "Unique identifier of the record",
  })
  id: number;

  @ManyToOne(() => StockModelDB, (stock) => stock)
  stock: StockModelDB;

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
