import * as Clube from './clube';
import * as Endereco from './endereco';
import * as Jogo from './jogo';
import * as Mensagens from './mensagens';
import * as PessoaJogadora from './pessoa-jogadora';
import * as RankingCommunity from './ranking-community';
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
  Clube.Ranking,
  Jogo.Jogo,
  Jogo.JogoStatus,
  Jogo.RankingJogo,
  Mensagens.Mensagens,
  RankingCommunity.RankingCommunity,
  RankingCommunity.RankingCommunityJogos,
  RankingCommunity.RankingCommunityPosicao,
];

export const AllModels = {
  ...PessoaJogadora,
  ...Telefone,
  ...Endereco,
  ...Clube,
  ...Jogo,
  ...Mensagens,
  ...RankingCommunity,
};
