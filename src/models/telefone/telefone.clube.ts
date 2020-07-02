import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { TELEFONE_CLUBE } from '~/utils/constants';

import { Clube } from '../clube/clube';

@Table({ tableName: TELEFONE_CLUBE, modelName: TELEFONE_CLUBE })
export class TelefoneClube extends BaseEntity<TelefoneClube> {
  @Column(DataType.STRING(9))
  public telefone!: string;

  @ForeignKey(() => Clube)
  @Column
  public clubeID!: number;
}
