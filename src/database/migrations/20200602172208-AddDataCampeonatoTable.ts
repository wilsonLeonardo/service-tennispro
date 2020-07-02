import SequelizeStatic, { QueryInterface } from 'sequelize';

import { CLUBE_CAMPEONATO } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.addColumn(CLUBE_CAMPEONATO, 'data', {
      type: Sequelize.DataTypes.DATE,
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn(CLUBE_CAMPEONATO, 'data');
  },
};
