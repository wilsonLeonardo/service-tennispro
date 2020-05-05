import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import { push } from '~/services/firebase';
import { genToken } from '~/services/token';

import { successMessage, failMessage } from '../helpers/handleResponse';

export default {
  async login(req: Request, res: Response) {
    try {
      const { login, senha } = req.body;

      const user = await req.models.Usuario.findOne({
        where: { login },
        include: [
          {
            model: req.models.Pessoa,
          },
          {
            model: req.models.UsuarioPerfil,
          },
        ],
      });

      if (user) {
        if (await user.comparePassword(senha)) {
          const token = genToken(user);

          return res.send(successMessage(user, { token }));
        }
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send(failMessage(HttpStatus.UNAUTHORIZED, 'Senha incorreta'));
      }

      return res
        .status(HttpStatus.NOT_FOUND)
        .send(failMessage(HttpStatus.NOT_FOUND, 'Usuário não encontrado'));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(
          failMessage(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Falha ao autenticar usuário',
            error
          )
        );
    }
  },
  async change(req: Request, res: Response) {
    try {
      const { currentpassword, newpassword } = req.body;
      const { user } = req;

      if (!user) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(failMessage(HttpStatus.BAD_REQUEST, 'Usuário não encontrado'));
      }

      if (!(await user.comparePassword(currentpassword))) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(failMessage(HttpStatus.BAD_REQUEST, 'Senha atual incorreta'));
      }

      user.senha = newpassword;
      await user.save();

      return res.send(
        successMessage({ message: 'Senha alterada com sucesso', user })
      );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Falha ao alterar senha'));
    }
  },
};
