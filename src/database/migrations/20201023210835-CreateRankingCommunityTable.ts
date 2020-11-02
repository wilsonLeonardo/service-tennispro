import SequelizeStatic, { QueryInterface } from 'sequelize';

import { RANKING_COMMUNITY, PESSOA } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(RANKING_COMMUNITY, {
      ...migrationDefaults(Sequelize),
      nome: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      senha: Sequelize.DataTypes.STRING,
      ownerID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: PESSOA,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(RANKING_COMMUNITY);
  },
};
