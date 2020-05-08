import SequelizeStatic, { QueryInterface } from 'sequelize';

import { PESSOA_CLUBES, PESSOA, CLUBE } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(PESSOA_CLUBES, {
      ...migrationDefaults(Sequelize),
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
    return queryInterface.dropTable(PESSOA_CLUBES);
  },
};
