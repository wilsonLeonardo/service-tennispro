import * as Endereco from './endereco';
import * as PessoaJogadora from './pessoa-jogadora';
import * as Telefone from './telefone';

export const Entities = [
  PessoaJogadora.Pessoa,
  PessoaJogadora.UsuarioPerfil,
  PessoaJogadora.Usuario,
  PessoaJogadora.UsuarioNivel,
  PessoaJogadora.UsuarioPlano,
  Telefone.Telefone,
  Endereco.Endereco,
];

export const AllModels = {
  ...PessoaJogadora,
  ...Telefone,
  ...Endereco,
};
