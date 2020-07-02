import { Table, Column, ForeignKey, HasOne } from 'sequelize-typescript';

import { BaseEntity } from '~/utils/base.model';
import { CLUBE } from '~/utils/constants';

import { EnderecoClube } from '../endereco/endereco.clube';
import { Usuario } from '../pessoa-jogadora/usuario';
import { TelefoneClube } from '../telefone/telefone.clube';

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

  @HasOne(() => TelefoneClube, {
    sourceKey: 'id',
    foreignKey: 'clubeID',
  })
  public telefone!: TelefoneClube;

  @HasOne(() => EnderecoClube, {
    foreignKey: 'clubeID',
  })
  public endereco!: EnderecoClube;
}
