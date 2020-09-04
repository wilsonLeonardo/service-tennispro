import SequelizeStatic, { QueryInterface } from 'sequelize';

import { RANKING } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.addColumn(RANKING, 'estatistica', {
      type: Sequelize.DataTypes.INTEGER,
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn(RANKING, 'estatistica');
  },
};
