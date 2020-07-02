import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { PESSOA_CAMPEONATOS } from '~/utils/constants';

import { ClubeCampeonato } from '../clube/clube.campeonatos';
import { Pessoa } from './pessoa';

@Table({ tableName: PESSOA_CAMPEONATOS, modelName: PESSOA_CAMPEONATOS })
export class PessoaCampeonatos extends BaseEntity<PessoaCampeonatos> {
  @ForeignKey(() => ClubeCampeonato)
  @Column
  public campeonatoId!: number;

  @ForeignKey(() => Pessoa)
  @Column
  public pessoaId!: number;

  @BelongsTo(() => ClubeCampeonato, {
    foreignKey: 'campeonatoId',
  })
  public campeonato: ClubeCampeonato;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'pessoaId',
  })
  public pessoa: Pessoa;
}
