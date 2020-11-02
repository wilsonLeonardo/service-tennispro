import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { RANKING_COMMUNITY_POSICAO } from '~/utils/constants';

import { Pessoa } from '../pessoa-jogadora/pessoa';
import { RankingCommunity } from './ranking.community';

@Table({
  tableName: RANKING_COMMUNITY_POSICAO,
  modelName: RANKING_COMMUNITY_POSICAO,
})
export class RankingCommunityPosicao extends BaseEntity<
  RankingCommunityPosicao
> {
  @Column
  public posicao!: number;

  @Column
  public estatistica!: number;

  @ForeignKey(() => Pessoa)
  @Column
  public pessoaID!: number;

  @ForeignKey(() => RankingCommunity)
  @Column
  public rankingCommunityID!: number;

  @BelongsTo(() => RankingCommunity, {
    foreignKey: 'rankingCommunityID',
  })
  public rankingCommunity: RankingCommunity;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'pessoaID',
  })
  public pessoa: Pessoa;
}
