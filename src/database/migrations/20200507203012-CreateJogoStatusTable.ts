import SequelizeStatic, { QueryInterface } from 'sequelize';

import { JOGO_STATUS } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(JOGO_STATUS, {
      ...migrationDefaults(Sequelize),
      status: Sequelize.DataTypes.STRING,
      active: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(JOGO_STATUS);
  },
};
