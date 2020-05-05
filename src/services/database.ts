import { Sequelize } from 'sequelize-typescript';

import { Entities } from '~/models';

import config from './config';

const {
  database: {
    dialect = 'postgres',
    host,
    port,
    database,
    username,
    password,
    logger,
    dialectOptions,
  },
} = config;

const sequelize = new Sequelize({
  dialect,
  host,
  port,
  database,
  username,
  password,
  models: Entities,
  // eslint-disable-next-line no-console
  logging: logger ? console.log : false,
  dialectOptions,
});

export { sequelize };
