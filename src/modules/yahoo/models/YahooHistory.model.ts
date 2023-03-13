import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { YahooStockHIstory } from '@/app/entities/YahooHistory/YahooHistory.entity';
import { StockModelDB } from '@/modules/b3/models/Stock.model';

@Entity({
  name: 'yahoo_history',
})
export class YahooHistoryModelDB implements YahooStockHIstory {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique identifier of the record',
  })
  id: number;

  // A Many to One relationship is used here because the same stock can have multiple records in the history table
  @ManyToOne(() => StockModelDB, (stock) => stock)
  stock: StockModelDB;

  @Column({
    type: 'date',
    comment: 'Date of the record',
  })
  date: Date;

  @Column({
    nullable: true,
    comment: 'Opening price',
    type: 'decimal',
    precision: 15,
    scale: 5,
  })
  open: number;

  @Column({
    nullable: true,
    comment: 'Highest price',
    type: 'decimal',
    precision: 15,
    scale: 5,
  })
  high: number;

  @Column({
    nullable: true,
    comment: 'Lowest price',
    type: 'decimal',
    precision: 15,
    scale: 5,
  })
  low: number;

  @Column({
    nullable: true,
    comment: 'Closing price',
    type: 'decimal',
    precision: 15,
    scale: 5,
  })
  close: number;

  @Column({
    nullable: true,
    comment: 'Adjusted closing price',
    type: 'decimal',
    precision: 15,
    scale: 5,
  })
  adjClose: number;

  @Column({
    nullable: true,
    comment: 'Volume',
    type: 'decimal',
    precision: 15,
    scale: 5,
  })
  volume: number;

  @Column({
    type: 'timestamp',
    comment: 'Date of creation',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    comment: 'Date of last update',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
