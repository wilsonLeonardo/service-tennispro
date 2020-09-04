import SequelizeStatic, { QueryInterface } from 'sequelize';

import { RANKING, PESSOA, CLUBE } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(RANKING, {
      ...migrationDefaults(Sequelize),
      posicao: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
      },
      clubeID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CLUBE,
          key: 'id',
        },
      },
      pessoaID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: PESSOA,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(RANKING);
  },
};
