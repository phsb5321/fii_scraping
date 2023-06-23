import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';

@Entity({
  name: 'b3_history',
})
export class B3HistoryModelDB {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique identifier of the record',
  })
  id: number;

  @ManyToOne(() => FiiModelDB, (fii) => fii.id, {
    nullable: false,
  })
  fii: FiiModelDB;

  @Column({
    nullable: true,
    comment: 'Trading date',
  })
  pregao_date: Date;

  @Column({
    nullable: true,
    comment: 'Paper specification',
  })
  especificacao_papel: string;

  @Column({
    nullable: true,
    comment: 'Number of trades made during the day',
    type: 'decimal',
    precision: 15,
    scale: 0,
  })
  numero_negocios: number;

  @Column({
    nullable: true,
    comment:
      'Percentage of the paper in the total number of trades of the day. Example: 0.672',
    type: 'decimal',
    precision: 15,
    scale: 5,
  })
  participacao_papel: number;

  @Column({
    nullable: true,
    comment: 'Total number of traded papers during the day',
    type: 'decimal',
    precision: 15,
    scale: 0,
  })
  quantidade_total_titulos: number;

  @Column({
    nullable: true,
    comment: 'Total volume of traded papers during the day in R$',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  volume_total_titulos: number;

  @Column({
    nullable: true,
    comment: 'Opening price of the paper during the day in R$',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  preco_abertura: number;

  @Column({
    nullable: true,
    comment: 'Minimum price of the paper during the day in R$',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  preco_minimo: number;

  @Column({
    nullable: true,
    comment: 'Maximum price of the paper during the day in R$',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  preco_maximo: number;

  @Column({
    nullable: true,
    comment: 'Average price of the paper during the day in R$',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  preco_medio: number;

  @Column({
    nullable: true,
    comment: 'Closing price of the paper during the day in R$',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  preco_fechamento: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: 'Timestamp when the record was created',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: 'Timestamp when the record was last updated',
  })
  updatedAt: Date;
}
