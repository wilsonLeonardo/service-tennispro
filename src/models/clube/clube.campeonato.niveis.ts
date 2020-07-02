import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { CLUBE_CAMPEONATO_NIVEIS } from '~/utils/constants';

import { UsuarioNivel } from '../pessoa-jogadora/usuario.nivel';
import { ClubeCampeonato } from './clube.campeonatos';

@Table({
  tableName: CLUBE_CAMPEONATO_NIVEIS,
  modelName: CLUBE_CAMPEONATO_NIVEIS,
})
export class ClubeCampeonatoNiveis extends BaseEntity<ClubeCampeonatoNiveis> {
  @Column
  public premio!: number;

  @Column
  public taxaInscricao!: number;

  @ForeignKey(() => ClubeCampeonato)
  @Column
  public campeonatoID!: number;

  @ForeignKey(() => UsuarioNivel)
  @Column
  public nivelID!: number;

  @BelongsTo(() => UsuarioNivel, {
    foreignKey: 'nivelID',
  })
  public nivel!: UsuarioNivel;
}
