import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { CLUBE_CAMPEONATO } from '~/utils/constants';

import { PessoaCampeonatos } from '../pessoa-jogadora/pessoa.campeonatos';
import { Clube } from './clube';
import { ClubeCampeonatoNiveis } from './clube.campeonato.niveis';
import { ClubeCampeonatoStatus } from './clube.campeonato.status';

@Table({ tableName: CLUBE_CAMPEONATO, modelName: CLUBE_CAMPEONATO })
export class ClubeCampeonato extends BaseEntity<ClubeCampeonato> {
  @Column
  public nome!: string;

  @Column
  public dataInicial!: Date;

  @Column
  public dataFinal!: Date;

  @HasMany(() => ClubeCampeonatoNiveis)
  public niveis!: ClubeCampeonatoNiveis[];

  @ForeignKey(() => ClubeCampeonatoStatus)
  @Column
  public statusId!: number;

  @ForeignKey(() => Clube)
  @Column
  public clubeID!: number;

  @HasMany(() => PessoaCampeonatos)
  public inscritos!: PessoaCampeonatos[];

  @BelongsTo(() => ClubeCampeonatoStatus, {
    foreignKey: 'statusId',
  })
  public status!: ClubeCampeonatoStatus;

  @BelongsTo(() => Clube, {
    foreignKey: 'clubeID',
  })
  public clube!: Clube;
}
