import SequelizeStatic, { QueryInterface } from 'sequelize';

import {
  CLUBE_CAMPEONATO,
  CLUBE_CAMPEONATO_NIVEIS,
  USUARIO_NIVEL,
} from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(CLUBE_CAMPEONATO_NIVEIS, {
      ...migrationDefaults(Sequelize),
      premio: Sequelize.DataTypes.FLOAT,
      taxaInscricao: Sequelize.DataTypes.FLOAT,
      campeonatoID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CLUBE_CAMPEONATO,
          key: 'id',
        },
      },
      nivelID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USUARIO_NIVEL,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(CLUBE_CAMPEONATO_NIVEIS);
  },
};
