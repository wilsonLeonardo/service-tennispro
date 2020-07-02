import SequelizeStatic, { QueryInterface } from 'sequelize';

import { PESSOA } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.addColumn(PESSOA, 'dataLimitePlano', {
      type: Sequelize.DataTypes.DATE,
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn(PESSOA, 'dataLimitePlano');
  },
};
