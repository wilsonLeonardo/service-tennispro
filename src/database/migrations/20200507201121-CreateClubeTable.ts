import SequelizeStatic, { QueryInterface } from 'sequelize';

import { CLUBE, USUARIO } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(CLUBE, {
      ...migrationDefaults(Sequelize),
      nome: Sequelize.DataTypes.STRING,
      quadras: Sequelize.DataTypes.INTEGER,
      aluguel: Sequelize.DataTypes.FLOAT,
      mensalidade: Sequelize.DataTypes.FLOAT,
      usuarioID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USUARIO,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(CLUBE);
  },
};
