import { Table, Column, ForeignKey, DataType } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { ENDERECO } from '~/utils/constants';

import { Pessoa } from '../pessoa-jogadora/pessoa';

@Table({ tableName: ENDERECO, modelName: ENDERECO })
export class Endereco extends BaseEntity<Endereco> {
  @Column
  public bairro!: string;

  @Column(DataType.STRING(8))
  public cep!: string;

  @Column
  public estado!: string;

  @Column
  public cidade!: string;

  @ForeignKey(() => Pessoa)
  @Column
  public pessoaID!: number;
}
