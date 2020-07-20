import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { Op } from 'sequelize';

import { successMessage, failMessage } from '~/helpers/handleResponse';

export default {
  async create(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, clube } = req.body;

      const dataJogo = new Date(data);

      dataJogo.setHours(dataJogo.getHours() + 1);

      const jogoJson = {
        jogador1: req.user.pessoa.id,
        jogador2: id,
        statusId: 1,
        data,
        clube,
      };

      const jogoClube = await req.models.Clube.findByPk(clube);

      const campeonato = await req.models.ClubeCampeonato.findOne({
        where: {
          [Op.and]: [
            {
              [Op.and]: [
                { dataInicial: { [Op.gte]: data } },
                { dataFinal: { [Op.lte]: data } },
              ],
            },
            { clubeID: clube },
            { statusId: 1 },
          ],
        },
      });

      if (campeonato) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(
            failMessage(
              HttpStatus.BAD_REQUEST,
              'O clube terá um campeonato nesta data! Tente outra data'
            )
          );
      }

      const jogos = await req.models.Jogo.findAndCountAll({
        where: {
          data: { [Op.gte]: data, [Op.lte]: dataJogo },
          statusId: { [Op.lt]: 3 },
          clube,
        },
      });

      if (jogos.count > jogoClube.quadras) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(
            failMessage(
              HttpStatus.BAD_REQUEST,
              'Existe jogos demais no clube em esse horário! Tente outro horário'
            )
          );
      }

      const meusJogo = await req.models.Jogo.findOne({
        where: {
          [Op.or]: [
            { jogador1: req.user.pessoa.id },
            { jogador2: req.user.pessoa.id },
          ],
          data: { [Op.gte]: data, [Op.lte]: dataJogo },
          statusId: { [Op.lt]: 3 },
        },
      });

      if (meusJogo) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(
            failMessage(
              HttpStatus.BAD_REQUEST,
              'Você já possui um jogo marcado para esse horário! Tente outro horário'
            )
          );
      }

      await req.models.Jogo.create(jogoJson);

      return res.send(
        successMessage(
          { message: 'Jogo solicitado com sucesso' },
          HttpStatus.OK
        )
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao solicitar o jogo', error)
        );
    }
  },
  async findAceitos(req: Request, res: Response) {
    try {
      const jogo = await req.models.Jogo.findAll({
        where: {
          [Op.or]: [
            { jogador1: req.user.pessoa.id },
            { jogador2: req.user.pessoa.id },
          ],
          statusId: 2,
        },
        include: [
          {
            model: req.models.Pessoa,
            as: 'joga1',
            include: [req.models.Usuario],
          },
          {
            model: req.models.Pessoa,
            as: 'joga2',
            include: [req.models.Usuario],
          },
          'jogoClube',
        ],
      });

      return res.send(successMessage(jogo, HttpStatus.OK));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao encontrar jogos ativos',
            error
          )
        );
    }
  },
  async findPendentes(req: Request, res: Response) {
    try {
      const jogo = await req.models.Jogo.findAll({
        where: {
          [Op.or]: [
            { jogador1: req.user.pessoa.id },
            { jogador2: req.user.pessoa.id },
          ],
          statusId: 1,
        },
        include: [
          {
            model: req.models.Pessoa,
            as: 'joga1',
            include: [req.models.Usuario],
          },
          {
            model: req.models.Pessoa,
            as: 'joga2',
            include: [req.models.Usuario],
          },
          'jogoClube',
        ],
      });

      return res.send(successMessage(jogo, HttpStatus.OK));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao encontrar jogos pendentes',
            error
          )
        );
    }
  },
  async findFinalizados(req: Request, res: Response) {
    try {
      const jogo = await req.models.Jogo.findAll({
        where: {
          [Op.or]: [
            { jogador1: req.user.pessoa.id },
            { jogador2: req.user.pessoa.id },
          ],
          statusId: 4,
        },
        include: [
          {
            model: req.models.Pessoa,
            as: 'joga1',
            include: [req.models.Usuario],
          },
          {
            model: req.models.Pessoa,
            as: 'joga2',
            include: [req.models.Usuario],
          },
          'jogoClube',
        ],
      });

      return res.send(successMessage(jogo, HttpStatus.OK));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao encontrar jogos finalizados',
            error
          )
        );
    }
  },
  async updateStatus(req: Request, res: Response) {
    try {
      const { statusId } = req.body;
      const { id } = req.params;

      const jogo = await req.models.Jogo.findByPk(id);

      jogo.statusId = statusId;

      await jogo.save();

      let message;

      if (statusId === 2) message = 'Jogo ativo com sucesso!';
      else if (statusId === 3) message = 'Jogo cancelado!';

      return res.send(successMessage({ message }, HttpStatus.OK));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao mudar status do jogo',
            error
          )
        );
    }
  },
  async updateGanhador(req: Request, res: Response) {
    try {
      const { ganhador } = req.body;
      const { id } = req.params;

      const jogo = await req.models.Jogo.findByPk(id);

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
      if (jogo.ganhador === ganhador) {
        jogo.statusId = 4;

        await jogo.save();

        return res.send(
          successMessage(
            { message: 'Jogo encerrado. Parabéns!' },
            HttpStatus.OK
          )
        );
      }

      jogo.ganhador = null;
      jogo.statusId = 4;

      await jogo.save();

      return res.send(
        successMessage(
          { message: 'Jogo anulado. Ambos declararam o mesmo resultado!' },
          HttpStatus.BAD_REQUEST
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
  async meuStatus(req: Request, res: Response) {
    try {
      const { id } = req.user.pessoa;

      const meusJogos = await req.models.Jogo.count({
        where: {
          [Op.or]: [{ jogador1: id }, { jogador2: id }],
          statusId: 4,
        },
      });

      const minhasVitorias = await req.models.Jogo.count({
        where: {
          [Op.or]: [
            {
              [Op.and]: [{ jogador1: id }, { ganhador: 'jogador1' }],
            },
            {
              [Op.and]: [{ jogador2: id }, { ganhador: 'jogador2' }],
            },
          ],
          statusId: 4,
        },
      });

      const minhaDerrotas = meusJogos - minhasVitorias;

      const data = {
        jogos: meusJogos,
        vitorias: minhasVitorias,
        derrotas: minhaDerrotas,
      };

      return res.send(successMessage(data, HttpStatus.OK));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao definir seu status',
            error
          )
        );
    }
  },
};
