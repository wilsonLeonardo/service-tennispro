import { Table, Column, ForeignKey, HasOne } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { CLUBE } from '~/utils/constants';

import { Usuario } from '../pessoa-jogadora/usuario';

@Table({ tableName: CLUBE, modelName: CLUBE })
export class Clube extends BaseEntity<Clube> {
  @Column
  public nome!: string;

  @Column
  public quadras!: number;

  @Column
  public aluguel!: number;

  @Column
  public mensalidade!: number;

  @ForeignKey(() => Usuario)
  @Column
  public usuarioID!: number;

  @HasOne(() => Usuario, {
    sourceKey: 'usuarioID',
    foreignKey: 'id',
  })
  public usuario!: Usuario;
}
