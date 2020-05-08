import cep from 'cep-promise';
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

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
        senha: step1.password,
        usuarioPerfilID: Role.Professor,
      };
      const usuario = await req.models.Usuario.create(usuarioJson, {
        transaction: t,
      });

      const pessoaJson = {
        nome: step1.nomeCompleto,
        dataNascimento: step1.dataNascimento,
        email: step1.email,
        usuarioID: usuario.id,
        planoId: step1.plano,
        nivelId: step1.nivel,
      };

      const pessoa = await req.models.Pessoa.create(pessoaJson, {
        transaction: t,
      });

      const telefoneJson = {
        telefone: step1.telefone,
        pessoaID: pessoa.id,
      };

      await req.models.Telefone.create(telefoneJson, {
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

      await t.commit();

      const token = genToken(usuario);

      return res.send(
        successMessage(
          await req.models.Usuario.findByPk(usuario.id, {
            include: [
              {
                model: req.models.Pessoa,
                include: ['telefone'],
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
};
