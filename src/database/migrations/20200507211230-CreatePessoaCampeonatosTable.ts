import SequelizeStatic, { QueryInterface } from 'sequelize';

import {
  PESSOA_CAMPEONATOS,
  CLUBE_CAMPEONATO,
  PESSOA,
} from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(PESSOA_CAMPEONATOS, {
      ...migrationDefaults(Sequelize),
      campeonatoId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CLUBE_CAMPEONATO,
          key: 'id',
        },
      },
      pessoaId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: PESSOA,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(PESSOA_CAMPEONATOS);
  },
};
