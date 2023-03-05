import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
@Entity({
  name: 'fii_rancking',
})
export class FiiRankingModelDB {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Identificador único do registro.',
  })
  id: number;

  @ManyToOne(() => FiiModelDB, (fii) => fii.id, {
    nullable: false,
  })
  fii: FiiModelDB;

  @Column({
    nullable: true,
    comment: '',
  })
  setor: string;

  @Column({
    nullable: true,
    comment: 'Preço de fechamento da cota do Dia Anterior. (R$)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  preco_atual: number;

  @Column({
    nullable: true,
    comment: 'Quantidade de negócios realizados no Dia anterior. (un)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  liquidez_diaria: number;

  @Column({
    nullable: true,
    comment: 'Último dividendo anunciado. (R$)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dividendo: number;

  @Column({
    nullable: true,
    comment:
      'Retorno calculado sobre a divisão do último dividendo pela cota de fechamento do mês. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dividend_yield: number;

  @Column({
    nullable: true,
    comment: 'Soma do Dividend Yield nos últimos 3 meses. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dy_3m_acumulado: number;

  @Column({
    nullable: true,
    comment: 'Soma do Dividend Yield nos últimos 6 meses. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dy_6m_acumulado: number;

  @Column({
    nullable: true,
    comment: 'Soma do Dividend Yield nos últimos 12 meses. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dy_12m_acumulado: number;

  @Column({
    nullable: true,
    comment: 'Média do Dividend Yield nos últimos 3 meses. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dy_3m_media: number;

  @Column({
    nullable: true,
    comment: 'Média do Dividend Yield nos últimos 6 meses. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dy_6m_media: number;

  @Column({
    nullable: true,
    comment: 'Média do Dividend Yield nos últimos 12 meses. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dy_12m_media: number;

  @Column({
    nullable: true,
    comment:
      'Soma do Dividend Yield em relação aos dividendos anunciados no ano corrente. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dy_ano: number;

  @Column({
    nullable: true,
    comment:
      'Variação, em percentual, do valor do preço de fechamento nos últimos dois meses. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  variacao_preco: number;

  @Column({
    nullable: true,
    comment:
      'Retorno calculado considerando o Dividend Yield e a Variação da Cota no último mês. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  rentab_periodo: number;

  @Column({
    nullable: true,
    comment:
      'Retorno calculado considerando o Dividend Yield e a Variação da Cota desde o início do ano até o último mês.(%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  rentab_acumulada: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    comment: 'Último valor de Patrimônio Líquido anunciado pelo Fundo. (R$)',
  })
  patrimonio_liq: number;

  @Column({
    nullable: true,
    comment:
      'Resultado da divisão do Patrimônio Líquido sobre o total de cotas do fundo. (R$)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  vpa: number;

  @Column({
    nullable: true,
    comment:
      'Indicador calculado pela divisão do Preço da Cota sobre o Valor Patrimonial do fundo. (R$)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  pvpa: number;

  @Column({
    nullable: true,
    comment:
      'Retorno calculado sobre a divisão do último dividendo pelo valor patrimonial do mês. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  dy_patrimonial: number;

  @Column({
    nullable: true,
    comment:
      'Variação, em percentual, do valor patrimonial do fundo nos últimos dois meses. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  variacao_patrimonial: number;

  @Column({
    nullable: true,
    comment:
      'Retorno calculado considerando o Dividend Yield Patrimonial e a Variação da Cota Patrimonial no último mês. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  rentab_patr_no_periodo: number;

  @Column({
    nullable: true,
    comment:
      'Retorno calculado considerando o Dividend Yield Patrimonial e a Variação Patrimonial desde o início do ano até o último mês. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  rentab_patr_acumulada: number;

  @Column({
    nullable: true,
    comment:
      'Indicador calculado considerando a divisão da área vaga do fundo pela área total do fundo. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  vacancia_fisica: number;

  @Column({
    nullable: true,
    comment:
      'Indicador calculado considerando a divisão da área que não está gerando receita pela área total do fundo. (%)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  vacancia_financeira: number;

  @Column({
    nullable: true,
    comment: 'Quantidade de imóveis ou participações em imóveis do fundo. (un)',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  quantidade_ativos: number;

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
