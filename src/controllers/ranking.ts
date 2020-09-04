/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { Op } from 'sequelize';

import { successMessage, failMessage } from '~/helpers/handleResponse';
import { Ranking, Clube } from '~/models/clube';
import { RankingJogo } from '~/models/jogo';
// import { notification } from '~/services/push';

export default {
  async create(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const rankingExists = await req.models.Ranking.findOne({
        where: { clubeID: id, pessoaID: req.user.pessoa.id },
      });

      if (rankingExists) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(
            successMessage(
              { message: 'Usuario já está inscrito nesse ranking!' },
              HttpStatus.BAD_REQUEST
            )
          );
      }

      const rankingJogadores = await req.models.Ranking.count({
        where: { clubeID: id },
      });

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
        clubeID: id,
        posicao: rankingJogadores + 1,
      };

      await req.models.Ranking.create(rankingJson);

      return res.send(
        successMessage(
          {
            message: 'Inscrito no ranking com sucesso',
            qtdJogadores: rankingJogadores,
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
            'Erro ao se inscrever nesse ranking',
            error
          )
        );
    }
  },
  async meusRankings(req: Request, res: Response) {
    try {
      const meusRankings = await req.models.Ranking.findAll({
        where: { pessoaID: req.user.pessoa.id },
        attributes: ['clubeID', 'posicao'],
      });

      return res.send(successMessage(meusRankings, HttpStatus.OK));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao buscar rankings', error)
        );
    }
  },
  async index(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const participoDoRanking = await req.models.Ranking.findOne({
        where: { pessoaID: req.user.pessoa.id, clubeID: id },
      });

      const podium = await req.models.Ranking.findAll({
        where: { clubeID: id },
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

      const ranking = await req.models.Ranking.findAll({
        where: { clubeID: id, posicao: { [Op.gt]: 3 } },
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
      const jogos = await req.models.RankingJogo.findAll({
        where: { [Op.and]: [{ clubeID: id }, { statusId: { [Op.ne]: 4 } }] },
        attributes: ['id', 'statusId', 'ganhador'],
        order: [['createdAt', 'asc']],
        include: [
          {
            model: req.models.Pessoa,
            as: 'joga1',
            attributes: ['id', 'nome'],
            include: [
              {
                model: req.models.Ranking,
                where: { clubeID: id },
                attributes: ['clubeID', 'posicao'],
              },
            ],
          },
          {
            model: req.models.Pessoa,
            as: 'joga2',
            attributes: ['id', 'nome'],
            include: [
              {
                model: req.models.Ranking,
                where: { clubeID: id },
                attributes: ['clubeID', 'posicao'],
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
            participoDoRanking: !!participoDoRanking,
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
  async updateGanhador(req: Request, res: Response) {
    try {
      const { ganhador } = req.body;
      const { id } = req.params;

      const jogo = await req.models.RankingJogo.findByPk(id);

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

      const jogador1 = await req.models.Ranking.findOne({
        where: { pessoaID: jogo.jogador1 },
      });
      const jogador2 = await req.models.Ranking.findOne({
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
      const qtdClubes = await Clube.count();

      for (let i = 1; i <= qtdClubes; i += 1) {
        const rankingJogos = await RankingJogo.findAll({ //eslint-disable-line
          where: { [Op.and]: [{ clubeID: i }, { statusId: { [Op.ne]: 4 } }] },
        });

        const qtdJogos = rankingJogos.length;
        const qtdJogadores = await Ranking.count({ //eslint-disable-line
          where: { clubeID: i },
        });

        if (qtdJogos > 0) {
          if (qtdJogadores % 2 !== 0 && qtdJogadores > 0 && qtdJogos > 0) {
            const ultimoJogador = await Ranking.findOne({ //eslint-disable-line
              where: { posicao: qtdJogadores, clubeID: i },
            });
            ultimoJogador.posicao -= 1;
            ultimoJogador.estatistica = 1;
            await ultimoJogador.save(); //eslint-disable-line
          }

          for (let x = 0; x < qtdJogos; x += 1) {
            const jogador1 = await Ranking.findOne({ //eslint-disable-line
              where: { pessoaID: rankingJogos[x].jogador1, clubeID: i },
            });
            const jogador2 = await Ranking.findOne({ //eslint-disable-line
              where: { pessoaID: rankingJogos[x].jogador2, clubeID: i },
            });
            const posicaoAtualJogador1 = jogador1.posicao;
            const posicaoAtualJogador2 = jogador2.posicao;

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

        const jogadoresRanking = await Ranking.findAll({ //eslint-disable-line
          where: { clubeID: i },
          order: [['posicao', 'ASC']],
        });

        for (let j = 0; j <= qtdJogadores - 2; j += 2) {
          const jogoJson = {
            jogador1: jogadoresRanking[j].pessoaID,
            jogador2: jogadoresRanking[j + 1].pessoaID,
            clubeID: i,
            statusId: 2,
          };

          await RankingJogo.create(jogoJson); //eslint-disable-line
        }
      }

      return console.log('sucesso'); //eslint-disable-line
    } catch (error) {
      return console.log(error); //eslint-disable-line
    }
  },
};
