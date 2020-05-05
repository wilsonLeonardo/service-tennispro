import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

import { failMessage } from '~/helpers/handleResponse';
import { Role } from '~/utils/constants';

export function securityMiddleware(role: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.send(
        failMessage(HttpStatus.UNAUTHORIZED, 'Falha de autenticação')
      );
    }

    if (!role || !role.length) {
      return next();
    }

    if (req.user.usuarioPerfilID === Role.Master) {
      return next();
    }

    if (role.some(r => req.user.usuarioPerfilID === r)) {
      return next();
    }

    if (
      role.some(r => r === Role.User && req.user.usuarioPerfilID === Role.Admin)
    ) {
      return next();
    }

    return res.send(
      failMessage(HttpStatus.UNAUTHORIZED, 'Falha de autenticação')
    );
  };
}
