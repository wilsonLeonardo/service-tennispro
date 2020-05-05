import jwt from 'jsonwebtoken';

import { Usuario } from '~/models/pessoa-jogadora/usuario';

import config from './config';

const {
  auth: { secret },
} = config;

export function genToken(user: Usuario) {
  const token = jwt.sign({ id: user.id }, secret);

  return token;
}
