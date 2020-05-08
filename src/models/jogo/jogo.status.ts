import { Table, Column } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { JOGO_STATUS } from '~/utils/constants';

@Table({
  tableName: JOGO_STATUS,
  modelName: JOGO_STATUS,
})
export class JogoStatus extends BaseEntity<JogoStatus> {
  @Column
  public status!: string;
}
