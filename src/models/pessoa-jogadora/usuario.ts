import { hash, compare } from 'bcryptjs';
import {
  Table,
  Column,
  BeforeCreate,
  BeforeUpdate,
  HasOne,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { USUARIO } from '~/utils/constants';

import { Clube } from '../clube/clube';
import { Pessoa } from './pessoa';
import { UsuarioPerfil } from './usuario.perfil';

@Table({ tableName: USUARIO, modelName: USUARIO })
export class Usuario extends BaseEntity<Usuario> {
  @Column
  public login!: string;

  @Column
  public senha!: string;

  @Column
  public deviceIdentifier!: string;

  @Default(false)
  @Column
  public active!: boolean;

  @AllowNull
  @Column
  public imageFileName!: string;

  @Column
  public type!: string;

  @ForeignKey(() => UsuarioPerfil)
  @Column
  public usuarioPerfilID!: number;

  @HasOne(() => Pessoa, {
    foreignKey: 'usuarioID',
  })
  public pessoa: Pessoa;

  @HasOne(() => Clube, {
    foreignKey: 'usuarioID',
  })
  public clube: Clube;

  @BelongsTo(() => UsuarioPerfil, {
    foreignKey: 'usuarioPerfilID',
  })
  public perfil: UsuarioPerfil;

  @BeforeCreate
  @BeforeUpdate
  public static async addHash(user: Usuario) {
    user.active = true;
    if (user.changed('senha')) {
      const pass = await hash(user.senha, 10);
      user.senha = pass;
    }
  }

  public async comparePassword(senha: string) {
    return compare(senha, this.senha);
  }
}
