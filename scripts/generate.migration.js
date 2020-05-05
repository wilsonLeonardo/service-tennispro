/* eslint-disable no-console */
const fns = require('date-fns');
const fs = require('fs');
const path = require('path');

console.log('-> Creating new Migration:', process.argv[2]);

const model = `
import SequelizeStatic, { QueryInterface } from 'sequelize';

import { migrationDefaults } from '../defaults';
import {} from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    // Write migration code here.
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    // If migration fails, this will be called. Rollback your migration changes.
  },
};
`.trim();

const migrationsPath = path.resolve('src', 'database', 'migrations');

const date = new Date();
const format = `${fns.format(date, 'yyyyMMddHHmmss')}`;

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.substr(1)}`;
}

fs.writeFileSync(
  `${migrationsPath}/${format}-${capitalize(process.argv[2]) || ''}.ts`,
  model
);

console.log('<- Migration created successfully');
