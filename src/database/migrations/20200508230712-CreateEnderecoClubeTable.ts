import SequelizeStatic, { QueryInterface } from 'sequelize';

import { ENDERECO_CLUBE, CLUBE } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(ENDERECO_CLUBE, {
      ...migrationDefaults(Sequelize),
      bairro: Sequelize.DataTypes.STRING,
      cep: Sequelize.DataTypes.STRING,
      estado: Sequelize.DataTypes.STRING,
      cidade: Sequelize.DataTypes.STRING,
      numero: Sequelize.DataTypes.INTEGER,
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
    return queryInterface.dropTable(ENDERECO_CLUBE);
  },
};
