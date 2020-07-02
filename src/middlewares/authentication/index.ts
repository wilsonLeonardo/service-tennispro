import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { failMessage } from '~/helpers/handleResponse';
import config from '~/services/config';

const {
  auth: { secret },
} = config;

interface Payload {
  id: number;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  if (!token) {
    return res.send(
      failMessage(HttpStatus.UNAUTHORIZED, 'Token não encontrado')
    );
  }

  const [bearer, realToken] = token.split(' ');
  if (!/Bearer/.test(bearer)) {
    return res.send(
      failMessage(HttpStatus.UNAUTHORIZED, 'Token mal formatado')
    );
  }

  const payload = jwt.verify(realToken, secret);
  if (!payload) {
    return res.send(failMessage(HttpStatus.UNAUTHORIZED, 'Token invalido'));
  }

  req.user = await req.models.Usuario.findByPk((payload as Payload).id, {
    include: [
      {
        model: req.models.Clube,
      },
      {
        model: req.models.Pessoa,
        include: [req.models.Endereco],
      },
      {
        model: req.models.UsuarioPerfil,
      },
    ],
  });

  return next();
}
