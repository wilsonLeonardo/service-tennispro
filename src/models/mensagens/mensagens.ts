import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { MENSAGENS } from '~/utils/constants';

import { Pessoa } from '../pessoa-jogadora/pessoa';

@Table({
  tableName: MENSAGENS,
  modelName: MENSAGENS,
})
export class Mensagens extends BaseEntity<Mensagens> {
  @ForeignKey(() => Pessoa)
  @Column
  public pessoa1!: number;

  @ForeignKey(() => Pessoa)
  @Column
  public pessoa2!: number;

  @Column(DataType.STRING(200))
  public ultimaMensagem!: string;

  @Column(DataType.STRING(10))
  public pendentePor!: string;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'pessoa1',
  })
  public pess1: Pessoa;

  @BelongsTo(() => Pessoa, {
    foreignKey: 'pessoa2',
  })
  public pess2: Pessoa;
}
