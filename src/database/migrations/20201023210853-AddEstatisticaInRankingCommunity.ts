import SequelizeStatic, { QueryInterface } from 'sequelize';

import { RANKING_COMMUNITY_POSICAO } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.addColumn(RANKING_COMMUNITY_POSICAO, 'estatistica', {
      type: Sequelize.DataTypes.INTEGER,
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn(
      RANKING_COMMUNITY_POSICAO,
      'estatistica'
    );
  },
};
