import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { CLUBE_CAMPEONATO } from '~/utils/constants';

import { Clube } from './clube';
import { ClubeCampeonatoStatus } from './clube.campeonato.status';

@Table({ tableName: CLUBE_CAMPEONATO, modelName: CLUBE_CAMPEONATO })
export class ClubeCampeonato extends BaseEntity<ClubeCampeonato> {
  @Column
  public nome!: string;

  @Column
  public endereco!: string;

  @Column
  public premio!: number;

  @Column
  public taxaInscricao!: number;

  @ForeignKey(() => ClubeCampeonatoStatus)
  @Column
  public statusID!: number;

  @ForeignKey(() => Clube)
  @Column
  public clubeID!: number;

  @BelongsTo(() => ClubeCampeonatoStatus, {
    foreignKey: 'statusId',
  })
  public status!: ClubeCampeonatoStatus;

  @BelongsTo(() => Clube, {
    foreignKey: 'clubeID',
  })
  public clube!: Clube;
}
