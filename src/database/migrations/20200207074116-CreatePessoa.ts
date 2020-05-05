import SequelizeStatic, { QueryInterface } from 'sequelize';

import { PESSOA, USUARIO } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(PESSOA, {
      ...migrationDefaults(Sequelize),
      nome: Sequelize.DataTypes.STRING,
      dataNascimento: Sequelize.DataTypes.DATE,
      cpf: Sequelize.DataTypes.STRING(14),
      email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      usuarioID: {
        type: Sequelize.INTEGER,
        references: {
          model: USUARIO,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(PESSOA);
  },
};
