import { Table, Column } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { CLUBE_CAMPEONATO_NIVEIS } from '~/utils/constants';

@Table({
  tableName: CLUBE_CAMPEONATO_NIVEIS,
  modelName: CLUBE_CAMPEONATO_NIVEIS,
})
export class ClubeCampeonatoNiveis extends BaseEntity<ClubeCampeonatoNiveis> {
  @Column
  public niveis!: string;
}
