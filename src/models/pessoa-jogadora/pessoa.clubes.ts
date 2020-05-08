import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { PESSOA_CLUBES } from '~/utils/constants';

import { Clube } from '../clube/clube';
import { Pessoa } from './pessoa';

@Table({ tableName: PESSOA_CLUBES, modelName: PESSOA_CLUBES })
export class PessoaClubes extends BaseEntity<PessoaClubes> {
  @ForeignKey(() => Pessoa)
  @Column
  public pessoaID!: number;

  @ForeignKey(() => Clube)
  @Column
  public clubeID!: number;

  @BelongsTo(() => Clube, {
    foreignKey: 'clubeID',
  })
  public clube: Clube;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'pessoaID',
  })
  public pessoa: Pessoa;
}
