import SequelizeStatic, { QueryInterface } from 'sequelize';

import { TELEFONE_CLUBE, CLUBE } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(TELEFONE_CLUBE, {
      ...migrationDefaults(Sequelize),
      telefone: Sequelize.DataTypes.STRING,
      clubeID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CLUBE,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(TELEFONE_CLUBE);
  },
};
