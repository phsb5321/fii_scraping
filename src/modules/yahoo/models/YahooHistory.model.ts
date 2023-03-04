import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { StockModelDB } from '@/modules/b3/models/Stock.model';

@Entity({
  name: 'yahoo_history',
})
export class YahooHistoryModelDB {
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
    type: 'decimal',
    comment: 'Opening price',
  })
  open: number;

  @Column({
    type: 'decimal',
    comment: 'Highest price',
  })
  high: number;

  @Column({
    type: 'decimal',
    comment: 'Lowest price',
  })
  low: number;

  @Column({
    type: 'decimal',
    comment: 'Closing price',
  })
  close: number;

  @Column({
    type: 'decimal',
    comment: 'Adjusted closing price',
  })
  adjClose: number;

  @Column({
    type: 'decimal',
    comment: 'Volume',
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
