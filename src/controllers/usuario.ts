import cep from 'cep-promise';
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import { successMessage, failMessage } from '~/helpers/handleResponse';
import * as firebase from '~/services/firebase';
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
        usuarioPerfilID: Role.Usuario,
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
          { message: 'Usuário cadastrado com sucesso', token },
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
            'Erro ao cadastrar usuário',
            error
          )
        );
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.models.Usuario.findByPk(id);

      if (!user) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send(
            failMessage(
              HttpStatus.INTERNAL_SERVER_ERROR,
              'Usuário não encontrado'
            )
          );
      }

      // TODO: update code

      return res.send(successMessage(user));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Erro ao atualizar usuário'));
    }
  },
  // async message(req: Request, res: Response) {
  //   try {
  //     firebase.push('messages/aaaabc', 'que????');

  //     return res
  //       .status(HttpStatus.OK)
  //       .send(successMessage(HttpStatus.OK, 'deu bom'));
  //   } catch (error) {
  //     return res
  //       .status(HttpStatus.BAD_REQUEST)
  //       .send(failMessage(HttpStatus.BAD_REQUEST, 'deu ruim'));
  //   }
  // },
  async profile(req: Request, res: Response) {
    try {
      if (req.user && req.user.id) {
        const user = await req.models.Usuario.findByPk(req.user.id, {
          attributes: [
            'id',
            'login',
            'active',
            'imageFileName',
            'usuarioPerfilID',
            'createdAt',
            'updatedAt',
            'deletedAt',
          ],
          include: [
            {
              model: req.models.Pessoa,
              include: [req.models.Telefone, req.models.Endereco],
            },
            {
              model: req.models.UsuarioPerfil,
            },
          ],
        });
        return res.send(successMessage(user));
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(
          failMessage(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Falha ao encontrar usuário'
          )
        );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Falha ao retornar perfil'));
    }
  },
  async setAvatar(req: Request, res: Response) {
    try {
      const user = await req.models.Usuario.findByPk(req.body.usuarioID);
      if (!user) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(failMessage(HttpStatus.BAD_REQUEST, 'Usuário não encontrado'));
      }

      if (req.file === undefined) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(
            failMessage(
              HttpStatus.BAD_REQUEST,
              'Não é possível definir uma imagem inexistente'
            )
          );
      }

      user.imageFileName = (req.file as any).url;
      const newUser = await user.save();
      return res.send(successMessage(newUser));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Falha ao alterar avatar'));
    }
  },
};
