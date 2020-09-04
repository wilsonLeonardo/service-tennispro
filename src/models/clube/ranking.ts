import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { RANKING } from '~/utils/constants';

import { Pessoa } from '../pessoa-jogadora/pessoa';
import { Clube } from './clube';

@Table({ tableName: RANKING, modelName: RANKING })
export class Ranking extends BaseEntity<Ranking> {
  @Column
  public posicao!: number;

  @Column
  public estatistica!: number;

  @ForeignKey(() => Pessoa)
  @Column
  public pessoaID!: number;

  @ForeignKey(() => Clube)
  @Column
  public clubeID!: number;

  @BelongsTo(() => Clube, {
    foreignKey: 'clubeID',
  })
  public clube: Clube;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'pessoaID',
  })
  public pessoa: Pessoa;
}
