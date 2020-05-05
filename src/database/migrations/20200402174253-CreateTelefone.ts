import SequelizeStatic, { QueryInterface } from 'sequelize';

import { TELEFONE, PESSOA } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(TELEFONE, {
      ...migrationDefaults(Sequelize),
      telefone: Sequelize.DataTypes.STRING,
      pessoaID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: PESSOA,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(TELEFONE);
  },
};
