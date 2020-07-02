import SequelizeStatic, { QueryInterface } from 'sequelize';

import { USUARIO } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.addColumn(USUARIO, 'deviceIdentifier', {
      type: Sequelize.DataTypes.STRING,
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn(USUARIO, 'deviceIdentifier');
  },
};
