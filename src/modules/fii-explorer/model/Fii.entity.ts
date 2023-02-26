import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'fii',
})
export class FiiModelDB {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Identificador único do registro.',
  })
  id: number;

  @PrimaryColumn({
    nullable: false,
    comment: 'Código do Fundo Imobiliário. Ex: HGLG11',
  })
  codigo_do_fundo: string;

  @Column({
    nullable: true,
    comment: '',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    nullable: true,
    comment: '',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}