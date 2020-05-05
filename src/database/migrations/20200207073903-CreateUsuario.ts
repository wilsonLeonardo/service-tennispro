import SequelizeStatic, { QueryInterface } from 'sequelize';

import { USUARIO, USUARIO_PERFIL } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(USUARIO, {
      ...migrationDefaults(Sequelize),
      login: {
        type: Sequelize.STRING,
        unique: true,
      },
      senha: Sequelize.DataTypes.STRING,
      active: Sequelize.DataTypes.STRING,
      imageFileName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      type: Sequelize.DataTypes.STRING,
      usuarioPerfilID: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USUARIO_PERFIL,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(USUARIO);
  },
};
