import SequelizeStatic, { QueryInterface } from 'sequelize';

import { CLUBE_CAMPEONATO_STATUS } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(CLUBE_CAMPEONATO_STATUS, {
      ...migrationDefaults(Sequelize),
      status: Sequelize.DataTypes.STRING,
      active: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(CLUBE_CAMPEONATO_STATUS);
  },
};
