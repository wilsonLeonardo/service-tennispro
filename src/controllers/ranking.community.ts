/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { Op } from 'sequelize';

import { successMessage, failMessage } from '~/helpers/handleResponse';
import {
  RankingCommunity,
  RankingCommunityJogos,
  RankingCommunityPosicao,
} from '~/models/ranking-community';
// import { notification } from '~/services/push';

export default {
  async create(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const { nome, senha } = req.body;

      const exists = await req.models.RankingCommunity.findOne({
        where: { ownerID: req.user.pessoa.id },
      });

      if (exists)
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(
            failMessage(
              HttpStatus.BAD_REQUEST,
              'Não é possivel criar outro ranking'
            )
          );

      const rankingCommunityJson = {
        nome,
        senha,
        ownerID: req.user.pessoa.id,
      };

      const rankingCommunity = await req.models.RankingCommunity.create(
        rankingCommunityJson,
        { transaction: t }
      );

      const rankingCommunityPosicaoJson = {
        posicao: 1,
        estatistica: 0,
        pessoaID: req.user.pessoa.id,
        rankingCommunityID: rankingCommunity.id,
      };

      await req.models.RankingCommunityPosicao.create(
        rankingCommunityPosicaoJson,
        { transaction: t }
      );

      await t.commit();

      return res.send(
        successMessage(
          {
            message: 'Ranking criado com sucesso',
          },
          HttpStatus.OK
        )
      );
    } catch (error) {
      await t.rollback();
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao criar ranking', error)
        );
    }
  },
  async subscribe(req: Request, res: Response) {
    try {
      const { nome, senha } = req.body;

      const ranking = await req.models.RankingCommunity.findOne({
        where: { nome, senha, ownerID: { [Op.not]: req.user.pessoa.id } },
      });

      if (ranking) {
        const posicao = await req.models.RankingCommunityPosicao.findOne({
          where: {
            pessoaID: req.user.pessoa.id,
            rankingCommunityID: ranking.id,
          },
        });

        if (posicao) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .send(
              failMessage(HttpStatus.BAD_REQUEST, 'Você já está nesse ranking')
            );
        }

        const rankingJogadores = await req.models.RankingCommunityPosicao.count(
          {
            where: { rankingCommunityID: ranking.id },
          }
        );

        if (rankingJogadores === 50) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .send(
              successMessage(
                { message: 'Este ranking não suporta novos jogadores!' },
                HttpStatus.BAD_REQUEST
              )
            );
        }

        const rankingJson = {
          pessoaID: req.user.pessoa.id,
          rankingCommunityID: ranking.id,
          posicao: rankingJogadores + 1,
          estatistica: 0,
        };

        await req.models.RankingCommunityPosicao.create(rankingJson);

        return res.send(
          successMessage(
            {
              message: 'Inscrito no ranking com sucesso',
              qtdJogadores: rankingJogadores,
            },
            HttpStatus.OK
          )
        );
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Ranking não encontrado'));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao se inscrever no ranking',
            error
          )
        );
    }
  },
  async index(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const podium = await req.models.RankingCommunityPosicao.findAll({
        where: { rankingCommunityID: id, posicao: { [Op.lte]: 3 } },
        attributes: ['posicao', 'estatistica'],
        limit: 3,
        include: [
          {
            model: req.models.Pessoa,
            attributes: ['id', 'nome'],
            include: [
              {
                model: req.models.Usuario,
                attributes: ['id', 'imageFileName'],
              },
            ],
          },
        ],
        order: [['posicao', 'ASC']],
      });

      if (podium.length > 2) {
        const aux = podium[0];

        podium[0] = podium[1]; //eslint-disable-line
        podium[1] = aux;
      }

      const ranking = await req.models.RankingCommunityPosicao.findAll({
        where: { rankingCommunityID: id, posicao: { [Op.gt]: 3 } },
        attributes: ['posicao', 'estatistica'],
        include: [
          {
            model: req.models.Pessoa,
            attributes: ['id', 'nome'],
            include: [
              {
                model: req.models.Usuario,
                attributes: ['id', 'imageFileName'],
              },
            ],
          },
        ],
        order: [['posicao', 'ASC']],
      });

      const jogos = await req.models.RankingCommunityJogos.findAll({
        where: {
          [Op.and]: [{ rankingCommunityID: id }, { statusId: { [Op.ne]: 4 } }],
        },
        attributes: ['id', 'statusId', 'ganhador'],
        order: [['createdAt', 'asc']],
        include: [
          {
            model: req.models.Pessoa,
            as: 'joga1',
            attributes: ['id', 'nome'],
            include: [
              {
                model: req.models.RankingCommunityPosicao,
                where: { rankingCommunityID: id },
                attributes: ['rankingCommunityID', 'posicao'],
              },
            ],
          },
          {
            model: req.models.Pessoa,
            as: 'joga2',
            attributes: ['id', 'nome'],
            include: [
              {
                model: req.models.RankingCommunityPosicao,
                where: { rankingCommunityID: id },
                attributes: ['rankingCommunityID', 'posicao'],
              },
            ],
          },
        ],
      });

      return res.send(
        successMessage(
          {
            ranking,
            jogos,
            podium,
          },
          HttpStatus.OK
        )
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao buscar informações do ranking',
            error
          )
        );
    }
  },
  async meuRanking(req: Request, res: Response) {
    try {
      const meuRanking = await req.models.RankingCommunityPosicao.findOne({
        include: [
          {
            model: req.models.RankingCommunity,
            where: { ownerID: req.user.pessoa.id },
          },
        ],
      });

      return res.send(successMessage(meuRanking, HttpStatus.OK));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao buscar ranking', error)
        );
    }
  },
  async otherRankings(req: Request, res: Response) {
    try {
      const meusRankings = await req.models.RankingCommunityPosicao.findAll({
        where: { pessoaID: req.user.pessoa.id },
        include: [
          {
            model: req.models.RankingCommunity,
            where: {
              ownerID: { [Op.not]: req.user.pessoa.id },
            },
          },
        ],
      });

      return res.send(
        successMessage(
          meusRankings.filter(x => x.rankingCommunity !== null),
          HttpStatus.OK
        )
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao buscar rankings', error)
        );
    }
  },
  async gerenciarRanking(req: Request, res: Response) {
    try {
      const myRanking = await req.models.RankingCommunity.findOne({
        where: { ownerID: req.user.pessoa.id },
      });

      const ranking = await req.models.RankingCommunityPosicao.findAll({
        where: { rankingCommunityID: myRanking.id },
        attributes: ['posicao', 'estatistica'],
        include: [
          {
            model: req.models.Pessoa,
            attributes: ['id', 'nome'],
            include: [
              {
                model: req.models.Usuario,
                attributes: ['id', 'imageFileName'],
              },
            ],
          },
        ],
        order: [['posicao', 'ASC']],
      });

      return res.status(HttpStatus.OK).send(
        successMessage(
          {
            ranking,
          },
          HttpStatus.OK
        )
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao buscar jogadores ranking',
            error
          )
        );
    }
  },
  async removeJogador(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const { id } = req.params;

      const myRanking = await req.models.RankingCommunity.findOne({
        where: { ownerID: req.user.pessoa.id },
      });

      const rankingJogador = await req.models.RankingCommunityPosicao.findOne({
        where: { pessoaID: id, rankingCommunityID: myRanking.id },
        transaction: t,
      });

      const jogadorJogo = await req.models.RankingCommunityJogos.findOne({
        where: {
          rankingCommunityID: myRanking.id,
          [Op.or]: [{ jogador1: id }, { jogador2: id }],
        },
        transaction: t,
      });

      if (jogadorJogo.jogador1 === Number(id))
        jogadorJogo.ganhador = 'jogador2';
      else jogadorJogo.ganhador = 'jogador1';

      jogadorJogo.statusId = 4;

      await rankingJogador.destroy({ transaction: t });
      await jogadorJogo.save({ transaction: t });

      await t.commit();

      return res.send(
        successMessage(
          { message: 'Jogador removido do ranking com sucesso' },
          HttpStatus.OK
        )
      );
    } catch (error) {
      await t.rollback();
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao remover jogador do ranking',
            error
          )
        );
    }
  },
  async updateGanhador(req: Request, res: Response) {
    try {
      const { ganhador } = req.body;
      const { id } = req.params;

      const jogo = await req.models.RankingCommunityJogos.findByPk(id);

      if (
        (jogo.jogador1 === req.user.pessoa.id &&
          jogo.ganhador === 'jogador1') ||
        (jogo.jogador2 === req.user.pessoa.id && jogo.ganhador === 'jogador2')
      ) {
        return res.send(
          successMessage(
            { message: 'Aguarde a confirmação do adversário' },
            HttpStatus.OK
          )
        );
      }

      if (
        (jogo.jogador1 === req.user.pessoa.id && ganhador === 'jogador2') ||
        (jogo.jogador2 === req.user.pessoa.id && ganhador === 'jogador1')
      ) {
        jogo.ganhador = ganhador;
        jogo.statusId = 1;

        await jogo.save();

        return res.send(
          successMessage({ message: 'Jogo encerrado!' }, HttpStatus.OK)
        );
      }

      if (jogo.ganhador === null) {
        jogo.ganhador = ganhador;
        await jogo.save();

        return res.send(
          successMessage(
            { message: 'Aguarde a confirmação do adversário' },
            HttpStatus.OK
          )
        );
      }

      const jogador1 = await req.models.RankingCommunityPosicao.findOne({
        where: { pessoaID: jogo.jogador1 },
      });
      const jogador2 = await req.models.RankingCommunityPosicao.findOne({
        where: { pessoaID: jogo.jogador2 },
      });

      if (jogador1.posicao < jogador2.posicao) jogo.ganhador = 'jogador1';
      else jogo.ganhador = 'jogador2';

      jogo.statusId = 1;

      await jogo.save();

      return res.send(
        successMessage(
          {
            message:
              'Ambos declararam o mesmo resultado, será dado a vitoria ao jogagor da fileira de cima!',
          },
          HttpStatus.OK
        )
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao finalizar jogo', error)
        );
    }
  },
  async resultadoPartidas() {
    try {
      const qtdRankings = await RankingCommunity.count();

      for (let i = 1; i <= qtdRankings; i += 1) {
        const rankingJogos = await RankingCommunityJogos.findAll({ //eslint-disable-line
          where: {
            [Op.and]: [{ rankingCommunityID: i }, { statusId: { [Op.ne]: 4 } }],
          },
        });

        const qtdJogos = rankingJogos.length;
        const qtdJogadores = await RankingCommunityPosicao.count({ //eslint-disable-line
          where: { rankingCommunityID: i },
        });

        if (qtdJogos > 0) {
          if (qtdJogadores % 2 !== 0 && qtdJogadores > 0 && qtdJogos > 0) {
            const ultimoJogador = await RankingCommunityPosicao.findOne({ //eslint-disable-line
              where: { posicao: qtdJogadores, rankingCommunityID: i },
            });
            ultimoJogador.posicao -= 1;
            ultimoJogador.estatistica = 1;
            await ultimoJogador.save(); //eslint-disable-line
          }

          for (let x = 0; x < qtdJogos; x += 1) {
            const jogador1 = await RankingCommunityPosicao.findOne({ //eslint-disable-line
              where: {
                pessoaID: rankingJogos[x].jogador1,
                rankingCommunityID: i,
              },
              paranoid: false,
            });
            const jogador2 = await RankingCommunityPosicao.findOne({ //eslint-disable-line
              where: {
                pessoaID: rankingJogos[x].jogador2,
                rankingCommunityID: i,
              },
              paranoid: false,
            });
            const posicaoAtualJogador1 = jogador1.posicao;
            const posicaoAtualJogador2 = jogador2?.posicao;

            let top = 0;
            let bottom = 0;
            let maiorPosicao = '';
            if (jogador1.posicao < jogador2.posicao) {
              maiorPosicao = 'jogador1';
              top = jogador1.posicao;
              bottom = jogador2.posicao;
            } else {
              maiorPosicao = 'jogador2';
              top = jogador2.posicao;
              bottom = jogador1.posicao;
            }

            if (rankingJogos[x].ganhador === 'jogador1') {
              if (top - 1 !== 0) jogador1.posicao = top - 1;
              else jogador1.posicao = top;

              if (bottom + 1 <= qtdJogadores) jogador2.posicao = bottom + 1;
              else jogador2.posicao = bottom;
            } else if (rankingJogos[x].ganhador === 'jogador2') {
              if (top - 1 !== 0) jogador2.posicao = top - 1;
              else jogador2.posicao = top;

              if (bottom + 1 <= qtdJogadores) jogador1.posicao = bottom + 1;
              else jogador1.posicao = bottom;
            } else if (
              rankingJogos[x].ganhador === '' ||
              !rankingJogos[x].ganhador
            ) {
              if (maiorPosicao === 'jogador1') {
                if (top - 1 !== 0) jogador1.posicao = top - 1;
                else jogador1.posicao = top;

                if (bottom + 1 <= qtdJogadores) jogador2.posicao = bottom + 1;
                else jogador2.posicao = bottom;
              } else if (maiorPosicao === 'jogador2') {
                if (top - 1 !== 0) jogador2.posicao = top - 1;
                else jogador2.posicao = top;

                if (bottom + 1 <= qtdJogadores) jogador1.posicao = bottom + 1;
                else jogador1.posicao = bottom;
              }
            }
            jogador1.estatistica = posicaoAtualJogador1 - jogador1.posicao;
            jogador2.estatistica = posicaoAtualJogador2 - jogador2.posicao;

            rankingJogos[x].statusId = 4;

            await rankingJogos[x].save(); //eslint-disable-line
            await jogador1.save(); //eslint-disable-line
            await jogador2.save(); //eslint-disable-line
          }
        }

        if (qtdJogadores <= 1) continue; //eslint-disable-line

        const jogadoresRanking = await RankingCommunityPosicao.findAll({ //eslint-disable-line
          where: { rankingCommunityID: i },
          order: [['posicao', 'ASC']],
        });

        if (
          jogadoresRanking[jogadoresRanking.length - 1].posicao >
          jogadoresRanking.length
        ) {
          for (let j = 0; j < jogadoresRanking.length; j += 1) {
            jogadoresRanking[j].posicao = j + 1;
            jogadoresRanking[j].estatistica = 0;
            await jogadoresRanking[j].save(); //eslint-disable-line
          }
        }

        for (let j = 0; j <= qtdJogadores - 2; j += 2) {
          const jogoJson = {
            jogador1: jogadoresRanking[j].pessoaID,
            jogador2: jogadoresRanking[j + 1].pessoaID,
            rankingCommunityID: i,
            statusId: 2,
          };

          await RankingCommunityJogos.create(jogoJson); //eslint-disable-line
        }
      }

      return console.log('sucesso'); //eslint-disable-line
    } catch (error) {
      return console.log(error); //eslint-disable-line
    }
  },
};
