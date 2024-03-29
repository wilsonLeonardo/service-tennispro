import {
  Table,
  Column,
  ForeignKey,
  HasOne,
  HasMany,
} from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { PESSOA } from '~/utils/constants';

import { Endereco } from '../endereco/endereco';
import { Telefone } from '../telefone/telefone';
import { PessoaClubes } from './pessoa.clubes';
import { Usuario } from './usuario';
import { UsuarioNivel } from './usuario.nivel';
import { UsuarioPlano } from './usuario.plano';

@Table({ tableName: PESSOA, modelName: PESSOA })
export class Pessoa extends BaseEntity<Pessoa> {
  @Column
  public nome!: string;

  @Column
  public dataNascimento!: Date;

  @Column
  public dataLimitePlano!: Date;

  @Column
  public professorPreco!: number;

  @ForeignKey(() => Usuario)
  @Column
  public usuarioID!: number;

  @ForeignKey(() => Usuario)
  @Column
  public planoId!: number;

  @ForeignKey(() => Usuario)
  @Column
  public nivelId!: number;

  @HasOne(() => Telefone, {
    sourceKey: 'id',
    foreignKey: 'pessoaID',
  })
  public telefone!: Telefone;

  @HasOne(() => Usuario, {
    sourceKey: 'usuarioID',
    foreignKey: 'id',
  })
  public usuario!: Usuario;

  @HasOne(() => Endereco, {
    foreignKey: 'id',
  })
  public endereco!: Endereco;

  @HasMany(() => PessoaClubes)
  public clubes!: PessoaClubes[];

  @HasOne(() => UsuarioNivel, {
    sourceKey: 'nivelId',
    foreignKey: 'id',
  })
  public nivel!: UsuarioNivel;

  @HasOne(() => UsuarioPlano, {
    sourceKey: 'planoId',
    foreignKey: 'id',
  })
  public plano!: UsuarioPlano;
}
