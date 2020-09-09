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
      const step1 = req.body.Step1;

      const usuarioJson = {
        login: step1.email,
        senha: step1.senha,
        usuarioPerfilID: Role.Professor,
      };
      const usuario = await req.models.Usuario.create(usuarioJson, {
        transaction: t,
      });

      const dataFormatada = `${step1.nascimento.substring(
        3,
        6
      )}${step1.nascimento.substring(0, 3)}${step1.nascimento.substring(6)}`;

      const dataNascimento = new Date(dataFormatada);

      const pessoaJson = {
        nome: step1.nome,
        dataNascimento,
        usuarioID: usuario.id,
        nivelId: step1.nivel,
        professorPreco: step1.preco,
      };

      const pessoa = await req.models.Pessoa.create(pessoaJson, {
        transaction: t,
      });

      const myCep = await cep(step1.cep);

      const enderecoJson = {
        cep: myCep.cep,
        estado: myCep.state,
        bairro: myCep.neighborhood,
        cidade: myCep.city,
        pessoaID: pessoa.id,
      };

      await req.models.Endereco.create(enderecoJson, {
        transaction: t,
      });

      const clubeJson = {
        clubeID: step1.clube,
        pessoaID: pessoa.id,
      };

      await req.models.PessoaClubes.create(clubeJson, {
        transaction: t,
      });

      await t.commit();

      const token = genToken(usuario);

      return res.send(
        successMessage(
          await req.models.Usuario.findByPk(usuario.id, {
            include: [
              req.models.Clube,
              {
                model: req.models.Pessoa,
              },
              {
                model: req.models.UsuarioPerfil,
              },
            ],
          }),
          { message: 'Professor cadastrado com sucesso', token },
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
            'Erro ao cadastrar professor',
            error
          )
        );
    }
  },
  async show(req: Request, res: Response) {
    try {
      const { endereco } = req.user.pessoa;

      const professores = await req.models.Usuario.findAll({
        where: { usuarioPerfilID: Role.Professor },
        include: [
          {
            model: req.models.Pessoa,
            include: [
              req.models.UsuarioNivel,
              {
                model: req.models.PessoaClubes,
                include: [req.models.Clube],
              },
              {
                model: req.models.Endereco,
                attributes: [],
                where: {
                  [Op.and]: [
                    { estado: endereco.estado, cidade: endereco.cidade },
                  ],
                },
              },
            ],
          },
        ],
      });

      return res.send(
        successMessage(
          professores.filter(p => p.pessoa !== null),
          HttpStatus.OK
        )
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao buscar professores',
            error
          )
        );
    }
  },
};
