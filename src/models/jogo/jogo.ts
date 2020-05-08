import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { JOGO } from '~/utils/constants';

import { Pessoa } from '../pessoa-jogadora/pessoa';

@Table({ tableName: JOGO, modelName: JOGO })
export class Jogo extends BaseEntity<Jogo> {
  @ForeignKey(() => Pessoa)
  @Column
  public jogador1!: number;

  @ForeignKey(() => Pessoa)
  @Column
  public jogador2!: number;

  @Column
  public ganhador!: string;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'jogador1',
  })
  public joga1: Pessoa;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'jogador2',
  })
  public joga2: Pessoa;
}
