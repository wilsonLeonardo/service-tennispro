import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { Op } from 'sequelize';

import { successMessage, failMessage } from '~/helpers/handleResponse';

export default {
  async create(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const { campeonato } = req.body;
      const { id } = req.user.clube;

      const campeonatoJson = {
        nome: campeonato.nome,
        statusId: 1,
        clubeID: id,
        dataInicial: campeonato.dataInicial,
        dataFinal: campeonato.dataFinal,
      };

      const camp = await req.models.ClubeCampeonato.create(campeonatoJson, {
        transaction: t,
      });

      if (campeonato.especialPro.checked) {
        await req.models.ClubeCampeonatoNiveis.create(
          {
            premio: campeonato.especialPro.premio,
            taxaInscricao: campeonato.especialPro.taxa,
            campeonatoID: camp.id,
            nivelID: 1,
          },
          { transaction: t }
        );
      }
      if (campeonato.especial.checked) {
        await req.models.ClubeCampeonatoNiveis.create(
          {
            premio: campeonato.especial.premio,
            taxaInscricao: campeonato.especial.taxa,
            campeonatoID: camp.id,
            nivelID: 2,
          },
          { transaction: t }
        );
      }
      if (campeonato.interA.checked) {
        await req.models.ClubeCampeonatoNiveis.create(
          {
            premio: campeonato.interA.premio,
            taxaInscricao: campeonato.interA.taxa,
            campeonatoID: camp.id,
            nivelID: 3,
          },
          { transaction: t }
        );
      }
      if (campeonato.interB.checked) {
        await req.models.ClubeCampeonatoNiveis.create(
          {
            premio: campeonato.interB.premio,
            taxaInscricao: campeonato.interB.taxa,
            campeonatoID: camp.id,
            nivelID: 4,
          },
          { transaction: t }
        );
      }
      if (campeonato.principiante.checked) {
        await req.models.ClubeCampeonatoNiveis.create(
          {
            premio: campeonato.principiante.premio,
            taxaInscricao: campeonato.principiante.taxa,
            campeonatoID: camp.id,
            nivelID: 6,
          },
          { transaction: t }
        );
      }

      await t.commit();

      return res.send(
        successMessage(
          { message: 'Campeonato cadastrado com sucesso' },
          HttpStatus.CREATED
        )
      );
    } catch (error) {
      await t.rollback();

      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao cadastrar campeonato',
            error
          )
        );
    }
  },
  async register(req: Request, res: Response) {
    try {
      const { campId } = req.params;

      const registerJson = {
        campeonatoId: campId,
        pessoaId: req.user.pessoa.id,
      };

      const registro = await req.models.PessoaCampeonatos.findOne({
        where: {
          [Op.and]: [
            { campeonatoId: campId },
            { pessoaId: req.user.pessoa.id },
          ],
        },
      });

      if (registro) {
        return res.send(
          successMessage({ message: 'Você já está inscrito nesse campeonato!' })
        );
      }

      await req.models.PessoaCampeonatos.create(registerJson);

      return res.send(
        successMessage({
          message: 'Você foi inscrito nesse campeonato!',
        })
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao cadastrar nesse campeonato',
            error
          )
        );
    }
  },
  async cancelRegister(req: Request, res: Response) {
    try {
      const { campId } = req.params;

      const date = new Date();

      const registro = await req.models.PessoaCampeonatos.findOne({
        where: {
          [Op.and]: [
            { campeonatoId: campId },
            { pessoaId: req.user.pessoa.id },
          ],
        },
        include: ['campeonato'],
      });

      const dateCamp = new Date(registro.campeonato.dataInicial);
      dateCamp.setDate(dateCamp.getDate() - 3);

      if (date > dateCamp) {
        return res.send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Você não pode cancelar essa inscrição!'
          )
        );
      }

      await registro.destroy();

      return res.send(
        successMessage({
          message: 'Inscrição cancelada com sucesso!',
        })
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Não foi possível cancelar a inscrição',
            error
          )
        );
    }
  },
  async show(req: Request, res: Response) {
    try {
      const myCamps = await req.models.PessoaCampeonatos.findAll({
        where: { pessoaId: req.user.pessoa.id },
      });

      let campeonatos = await req.models.ClubeCampeonato.findAll({
        where: { statusId: 1 },
        include: [
          {
            model: req.models.Clube,
            include: [
              {
                model: req.models.EnderecoClube,
              },
            ],
          },
          {
            model: req.models.ClubeCampeonatoNiveis,
            include: ['nivel'],
          },
        ],
      });

      const date = new Date();
      date.setDate(date.getDate() - 1);

      myCamps.forEach(d => {
        campeonatos = campeonatos.filter(
          i => i.id !== d.campeonatoId && i.dataInicial <= date
        );
      });

      return res.send(successMessage(campeonatos));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao encontrar campeonatos',
            error
          )
        );
    }
  },
  async done(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const campeonato = await req.models.ClubeCampeonato.findOne({
        where: { [Op.and]: [{ id }, { clubeID: req.user.clube.id }] },
      });

      campeonato.statusId = 2;

      await campeonato.save();

      return res.send(successMessage({ message: 'Campeonato finalizado!' }));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao finalizar campeonato',
            error
          )
        );
    }
  },
  async findAtivo(req: Request, res: Response) {
    try {
      const campeonato = await req.models.ClubeCampeonato.findAll({
        where: { [Op.and]: [{ statusId: 1 }, { clubeID: req.user.clube.id }] },
        include: [
          {
            model: req.models.PessoaCampeonatos,
            include: [
              {
                model: req.models.Pessoa,
                attributes: ['nome'],
                include: ['nivel'],
              },
            ],
          },
          {
            model: req.models.Clube,
            include: [
              {
                model: req.models.EnderecoClube,
              },
            ],
          },
          {
            model: req.models.ClubeCampeonatoNiveis,
            include: ['nivel'],
          },
        ],
      });

      const date = new Date();
      date.setDate(date.getDate() + 1);

      campeonato.forEach(async d => {
        if (d.dataFinal <= date) d.statusId = 2;
        await d.save();
      });

      return res.send(
        successMessage(
          campeonato.filter(d => d.statusId !== 2),
          HttpStatus.OK
        )
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao encontrar campeonatos ativos',
            error
          )
        );
    }
  },
  async findFinalizado(req: Request, res: Response) {
    try {
      const campeonato = await req.models.ClubeCampeonato.findAll({
        where: { [Op.and]: [{ statusId: 2 }, { clubeID: req.user.clube.id }] },
        include: [
          {
            model: req.models.Clube,
            include: [
              {
                model: req.models.EnderecoClube,
              },
            ],
          },
          {
            model: req.models.ClubeCampeonatoNiveis,
            include: ['nivel'],
          },
        ],
      });

      return res.send(successMessage(campeonato, HttpStatus.OK));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao encontrar campeonatos encerrados',
            error
          )
        );
    }
  },
};
