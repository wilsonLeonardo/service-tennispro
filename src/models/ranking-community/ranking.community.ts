import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { RANKING_COMMUNITY } from '~/utils/constants';

import { Pessoa } from '../pessoa-jogadora/pessoa';

@Table({ tableName: RANKING_COMMUNITY, modelName: RANKING_COMMUNITY })
export class RankingCommunity extends BaseEntity<RankingCommunity> {
  @Column
  public nome!: string;

  @Column
  public senha!: string;

  @ForeignKey(() => Pessoa)
  @Column
  public ownerID!: number;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'ownerID',
  })
  public owner: Pessoa;
}
