import SequelizeStatic, { QueryInterface } from 'sequelize';

import {
  PESSOA,
  USUARIO,
  USUARIO_NIVEL,
  USUARIO_PLANO,
} from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(PESSOA, {
      ...migrationDefaults(Sequelize),
      nome: Sequelize.DataTypes.STRING,
      dataNascimento: Sequelize.DataTypes.DATE,
      cpf: Sequelize.DataTypes.STRING(14),
      usuarioID: {
        type: Sequelize.INTEGER,
        references: {
          model: USUARIO,
          key: 'id',
        },
      },
      nivelId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USUARIO_NIVEL,
          key: 'id',
        },
      },
      planoId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USUARIO_PLANO,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(PESSOA);
  },
};
