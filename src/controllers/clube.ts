import cep from 'cep-promise';
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { Op } from 'sequelize';

import { successMessage, failMessage } from '~/helpers/handleResponse';
import { genToken } from '~/services/token';
import { Role } from '~/utils/constants';

export default {
  async create(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const { clube } = req.body;

      const usuarioJson = {
        login: clube.email,
        senha: clube.senha,
        usuarioPerfilID: Role.Clube,
      };
      const usuario = await req.models.Usuario.create(usuarioJson, {
        transaction: t,
      });

      const clubeJson = {
        nome: clube.nome,
        quadras: clube.quadras,
        aluguel: clube.aluguel,
        mensalidade: clube.mensalidade,
        usuarioID: usuario.id,
      };

      const club = await req.models.Clube.create(clubeJson, {
        transaction: t,
      });

      const telefoneJson = {
        telefone: clube.telefone,
        clubeID: club.id,
      };

      await req.models.TelefoneClube.create(telefoneJson, {
        transaction: t,
      });

      const myCep = await cep(clube.cep);

      const enderecoJson = {
        cep: myCep.cep,
        estado: myCep.state,
        bairro: myCep.neighborhood,
        cidade: myCep.city,
        numero: clube.numero,
        clubeID: club.id,
      };

      await req.models.EnderecoClube.create(enderecoJson, {
        transaction: t,
      });

      await t.commit();

      const token = genToken(usuario);

      return res.send(
        successMessage(
          await req.models.Usuario.findByPk(usuario.id, {
            include: [
              {
                model: req.models.Clube,
                include: [req.models.TelefoneClube, req.models.EnderecoClube],
              },
              {
                model: req.models.UsuarioPerfil,
              },
            ],
          }),
          { message: 'Clube cadastrado com sucesso', token },
          HttpStatus.CREATED
        )
      );
    } catch (error) {
      await t.rollback();

      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao cadastrar clube', error)
        );
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { clube } = req.body;

      const clubeU = await req.models.Clube.findByPk(req.user.clube.id);

      clubeU.nome = clube.nome;
      clubeU.quadras = clube.quadras;
      clubeU.aluguel = clube.aluguel;
      clubeU.mensalidade = clube.mensalidade;

      return res.send(
        successMessage(
          { message: 'Dados atualizados com sucesso' },
          HttpStatus.OK
        )
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao encontrar clubes', error)
        );
    }
  },
  async findByCep(req: Request, res: Response) {
    try {
      const { CEP } = req.params;

      const enderecoUser = await cep(CEP);

      const clubes = await req.models.Clube.findAll({
        attributes: ['id', 'nome'],
        include: [
          {
            model: req.models.EnderecoClube,
            attributes: [],
            where: {
              [Op.and]: [
                { cidade: enderecoUser.city },
                { estado: enderecoUser.state },
              ],
            },
          },
        ],
      });

      return res.send(successMessage(clubes));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao encontrar clubes', error)
        );
    }
  },
  async findAll(req: Request, res: Response) {
    try {
      const clubes = await req.models.Clube.findAll({
        attributes: ['id', 'nome'],
        order: ['nome'],
        include: ['endereco'],
      });

      return res.send(successMessage(clubes));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao encontrar clubes', error)
        );
    }
  },
  async findByMyEndereco(req: Request, res: Response) {
    try {
      const myClubes = await req.models.PessoaClubes.findAll({
        where: { pessoaID: req.user.pessoa.id },
        attributes: [],
        include: [
          {
            model: req.models.Clube,
            attributes: ['id', 'nome'],
          },
        ],
      });

      return res.send(
        successMessage(
          myClubes.map(({ clube }) => ({ ...clube.get({ plain: true }) }))
        )
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao encontrar clubes', error)
        );
    }
  },
  async findAssociados(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const loggedID = req.user.pessoa.id;

      const associados = await req.models.PessoaClubes.findAll({
        where: { clubeID: id },
        attributes: [],
        include: [
          {
            model: req.models.Pessoa,
            attributes: ['id', 'nome'],
            include: [
              {
                model: req.models.Usuario,
                where: { usuarioPerfilID: Role.Usuario },
                attributes: [],
              },
            ],
          },
        ],
      });

      const associadosArray = associados
        .filter(obj => obj.pessoa && obj.pessoa.id !== loggedID)
        .map(({ pessoa }) => ({ ...pessoa.get({ plain: true }) }));

      return res.send(successMessage(associadosArray));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao encontrar associados do clubes',
            error
          )
        );
    }
  },
};
