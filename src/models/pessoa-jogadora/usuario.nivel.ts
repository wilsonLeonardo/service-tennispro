import { Table, Column } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { USUARIO_NIVEL } from '~/utils/constants';

@Table({ tableName: USUARIO_NIVEL, modelName: USUARIO_NIVEL })
export class UsuarioNivel extends BaseEntity<UsuarioNivel> {
  @Column
  public nivel!: string;

  @Column
  public active!: boolean;
}
