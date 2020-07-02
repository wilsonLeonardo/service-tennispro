import * as Clube from './clube';
import * as Endereco from './endereco';
import * as Jogo from './jogo';
import * as Mensagens from './mensagens';
import * as PessoaJogadora from './pessoa-jogadora';
import * as Telefone from './telefone';

export const Entities = [
  PessoaJogadora.Pessoa,
  PessoaJogadora.UsuarioPerfil,
  PessoaJogadora.Usuario,
  PessoaJogadora.UsuarioNivel,
  PessoaJogadora.UsuarioPlano,
  PessoaJogadora.PessoaCampeonatos,
  PessoaJogadora.PessoaClubes,
  Telefone.Telefone,
  Telefone.TelefoneClube,
  Endereco.Endereco,
  Endereco.EnderecoClube,
  Clube.Clube,
  Clube.ClubeCampeonato,
  Clube.ClubeCampeonatoNiveis,
  Clube.ClubeCampeonatoStatus,
  Jogo.Jogo,
  Jogo.JogoStatus,
  Mensagens.Mensagens,
];

export const AllModels = {
  ...PessoaJogadora,
  ...Telefone,
  ...Endereco,
  ...Clube,
  ...Jogo,
  ...Mensagens,
};
