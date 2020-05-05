import SequelizeStatic, { QueryInterface } from 'sequelize';

import { USUARIO_PLANO } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(USUARIO_PLANO, {
      ...migrationDefaults(Sequelize),
      plano: Sequelize.DataTypes.STRING,
      active: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(USUARIO_PLANO);
  },
};
