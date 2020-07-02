import { Table, Column, ForeignKey, DataType } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { ENDERECO_CLUBE } from '~/utils/constants';

import { Clube } from '../clube/clube';

@Table({ tableName: ENDERECO_CLUBE, modelName: ENDERECO_CLUBE })
export class EnderecoClube extends BaseEntity<EnderecoClube> {
  @Column
  public bairro!: string;

  @Column(DataType.STRING(8))
  public cep!: string;

  @Column
  public estado!: string;

  @Column
  public numero!: number;

  @Column
  public cidade!: string;

  @ForeignKey(() => Clube)
  @Column
  public clubeID!: number;
}
