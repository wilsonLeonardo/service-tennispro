import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { JOGO } from '~/utils/constants';

import { Clube } from '../clube/clube';
import { Pessoa } from '../pessoa-jogadora/pessoa';
import { JogoStatus } from './jogo.status';

@Table({ tableName: JOGO, modelName: JOGO })
export class Jogo extends BaseEntity<Jogo> {
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
  public clube!: number;

  @Column
  public ganhador!: string;

  @Column
  public data!: Date;

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
    foreignKey: 'clube',
  })
  public jogoClube!: Clube;
}
