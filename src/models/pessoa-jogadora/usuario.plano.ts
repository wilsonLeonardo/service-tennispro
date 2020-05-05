import { Table, Column } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { USUARIO_PLANO } from '~/utils/constants';

@Table({ tableName: USUARIO_PLANO, modelName: USUARIO_PLANO })
export class UsuarioPlano extends BaseEntity<UsuarioPlano> {
  @Column
  public plano!: string;

  @Column
  public active!: boolean;
}
