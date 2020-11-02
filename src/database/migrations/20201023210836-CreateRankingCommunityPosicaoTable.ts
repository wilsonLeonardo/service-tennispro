import SequelizeStatic, { QueryInterface } from 'sequelize';

import {
  RANKING_COMMUNITY_POSICAO,
  PESSOA,
  RANKING_COMMUNITY,
} from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(RANKING_COMMUNITY_POSICAO, {
      ...migrationDefaults(Sequelize),
      posicao: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
      },
      pessoaID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: PESSOA,
          key: 'id',
        },
      },
      rankingCommunityID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: RANKING_COMMUNITY,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(RANKING_COMMUNITY_POSICAO);
  },
};
