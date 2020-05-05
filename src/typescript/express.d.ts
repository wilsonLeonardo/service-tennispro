import 'express';
import { Sequelize } from 'sequelize-typescript';

import { AllModels } from '../models';
import { Usuario } from '../models/pessoa-jogadora/usuario';

declare module 'express' {
  interface Request {
    database: Sequelize;
    models: typeof AllModels;
    user: Usuario;
  }
}
