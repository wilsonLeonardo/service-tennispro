import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { TELEFONE } from '~/utils/constants';

import { Pessoa } from '../pessoa-jogadora/pessoa';

@Table({ tableName: TELEFONE, modelName: TELEFONE })
export class Telefone extends BaseEntity<Telefone> {
  @Column(DataType.STRING(2))
  public ddd!: string;

  @Column(DataType.STRING(9))
  public telefone!: string;

  @Column(DataType.STRING(45))
  public ramal!: string;

  @ForeignKey(() => Pessoa)
  @Column
  public pessoaID!: number;
}
