import SequelizeStatic, { QueryInterface } from 'sequelize';

import {
  RANKING_COMMUNITY_JOGOS,
  PESSOA,
  JOGO_STATUS,
  RANKING_COMMUNITY,
} from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(RANKING_COMMUNITY_JOGOS, {
      ...migrationDefaults(Sequelize),
      jogador1: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: PESSOA,
          key: 'id',
        },
      },
      jogador2: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: PESSOA,
          key: 'id',
        },
      },
      ganhador: Sequelize.DataTypes.STRING,
      statusId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: JOGO_STATUS,
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
    return queryInterface.dropTable(RANKING_COMMUNITY_JOGOS);
  },
};
