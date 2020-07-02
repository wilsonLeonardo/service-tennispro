import SequelizeStatic, { QueryInterface } from 'sequelize';

import { JOGO, CLUBE } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.addColumn(JOGO, 'clube', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: CLUBE,
        key: 'id',
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn(JOGO, 'clube');
  },
};
