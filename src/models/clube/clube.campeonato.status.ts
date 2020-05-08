import { Table, Column } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { CLUBE_CAMPEONATO_STATUS } from '~/utils/constants';

@Table({
  tableName: CLUBE_CAMPEONATO_STATUS,
  modelName: CLUBE_CAMPEONATO_STATUS,
})
export class ClubeCampeonatoStatus extends BaseEntity<ClubeCampeonatoStatus> {
  @Column
  public status!: string;
}
