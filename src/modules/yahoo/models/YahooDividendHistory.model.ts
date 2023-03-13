import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { YahooDividend } from '@/app/entities/Dividend/Dividend.entity';

@Entity({
  name: 'yahoo_dividend_history',
})
export class YahooDividendHistoryModelDB implements YahooDividend {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique identifier of the record',
  })
  id: number;

  @ManyToOne(() => StockModelDB, (stock) => stock)
  stock: StockModelDB;

  @Column({
    type: 'date',
    comment: 'Date of the record',
  })
  date: Date;

  @Column({
    comment: 'Dividend',
    type: 'decimal',
    precision: 15,
    scale: 5,
  })
  dividends: number;

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
