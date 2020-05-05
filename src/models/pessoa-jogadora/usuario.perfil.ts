import { Table, Column } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { USUARIO_PERFIL } from '~/utils/constants';

@Table({ tableName: USUARIO_PERFIL, modelName: USUARIO_PERFIL })
export class UsuarioPerfil extends BaseEntity<UsuarioPerfil> {
  @Column
  public perfil!: string;

  @Column
  public active!: boolean;
}
