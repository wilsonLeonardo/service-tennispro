import SequelizeStatic, { QueryInterface } from 'sequelize';

import { RANKING_JOGO, CLUBE } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.addColumn(RANKING_JOGO, 'clubeID', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: CLUBE,
        key: 'id',
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn(RANKING_JOGO, 'clubeID');
  },
};
