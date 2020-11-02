import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { RANKING_COMMUNITY_JOGOS } from '~/utils/constants';

import { JogoStatus } from '../jogo/jogo.status';
import { Pessoa } from '../pessoa-jogadora/pessoa';
import { RankingCommunity } from './ranking.community';

@Table({
  tableName: RANKING_COMMUNITY_JOGOS,
  modelName: RANKING_COMMUNITY_JOGOS,
})
export class RankingCommunityJogos extends BaseEntity<RankingCommunityJogos> {
  @ForeignKey(() => Pessoa)
  @Column
  public jogador1!: number;

  @ForeignKey(() => Pessoa)
  @Column
  public jogador2!: number;

  @ForeignKey(() => JogoStatus)
  @Column
  public statusId!: number;

  @ForeignKey(() => RankingCommunity)
  @Column
  public rankingCommunityID!: number;

  @Column
  public ganhador!: string;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'jogador1',
    as: 'joga1',
  })
  public joga1: Pessoa;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'jogador2',
    as: 'joga2',
  })
  public joga2: Pessoa;

  @BelongsTo(() => JogoStatus, {
    foreignKey: 'statusId',
  })
  public status!: JogoStatus;

  @BelongsTo(() => RankingCommunity, {
    foreignKey: 'rankingCommunityID',
  })
  public rankingCommunity!: RankingCommunity;
}
