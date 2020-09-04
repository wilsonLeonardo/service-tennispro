import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { RANKING_JOGO } from '~/utils/constants';

import { Clube } from '../clube/clube';
import { Pessoa } from '../pessoa-jogadora/pessoa';
import { JogoStatus } from './jogo.status';

@Table({ tableName: RANKING_JOGO, modelName: RANKING_JOGO })
export class RankingJogo extends BaseEntity<RankingJogo> {
  @ForeignKey(() => Pessoa)
  @Column
  public jogador1!: number;

  @ForeignKey(() => Pessoa)
  @Column
  public jogador2!: number;

  @ForeignKey(() => JogoStatus)
  @Column
  public statusId!: number;

  @ForeignKey(() => Clube)
  @Column
  public clubeID!: number;

  @Column
  public ganhador!: string;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'jogador1',
    as: 'joga1',
  })
  public joga1: Pessoa;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'jogador2',
    as: 'joga2',
  })
  public joga2: Pessoa;

  @BelongsTo(() => JogoStatus, {
    foreignKey: 'statusId',
  })
  public status!: JogoStatus;

  @BelongsTo(() => Clube, {
    foreignKey: 'clubeID',
  })
  public jogoClube!: Clube;
}
