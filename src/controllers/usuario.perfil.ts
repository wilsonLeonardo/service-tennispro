import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import { successMessage, failMessage } from '../helpers/handleResponse';

export default {
  async show(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page, 10) - 1 || 0;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = page * limit;

      const usuarioPerfis = await req.models.UsuarioPerfil.findAll({
        limit,
        offset,
      });

      return await res.send(successMessage(usuarioPerfis));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(
          failMessage(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Erro ao buscar perfis de usuário'
          )
        );
    }
  },
};
