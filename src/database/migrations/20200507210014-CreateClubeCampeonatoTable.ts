import SequelizeStatic, { QueryInterface } from 'sequelize';

import {
  CLUBE_CAMPEONATO,
  CLUBE,
  CLUBE_CAMPEONATO_STATUS,
} from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(CLUBE_CAMPEONATO, {
      ...migrationDefaults(Sequelize),
      nome: Sequelize.DataTypes.STRING,
      endereco: Sequelize.DataTypes.STRING,
      premio: Sequelize.DataTypes.FLOAT,
      taxaInscricao: Sequelize.DataTypes.FLOAT,
      statusId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CLUBE_CAMPEONATO_STATUS,
          key: 'id',
        },
      },
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
    return queryInterface.dropTable(CLUBE_CAMPEONATO);
  },
};
