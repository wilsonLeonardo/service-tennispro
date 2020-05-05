import SequelizeStatic, { QueryInterface } from 'sequelize';

import { ENDERECO, PESSOA } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(ENDERECO, {
      ...migrationDefaults(Sequelize),
      bairro: Sequelize.DataTypes.STRING,
      cep: Sequelize.DataTypes.STRING,
      estado: Sequelize.DataTypes.STRING,
      cidade: Sequelize.DataTypes.STRING,
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
    return queryInterface.dropTable(ENDERECO);
  },
};
