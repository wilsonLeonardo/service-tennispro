import SequelizeStatic, { QueryInterface } from 'sequelize';

import { MENSAGENS, PESSOA } from '~/utils/constants';

import { migrationDefaults } from '../defaults';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.createTable(
      MENSAGENS,
      {
        ...migrationDefaults(Sequelize),
        pessoa1: {
          type: Sequelize.DataTypes.INTEGER,
          unique: 'actionsUnique',
          references: {
            model: PESSOA,
            key: 'id',
          },
        },
        pessoa2: {
          type: Sequelize.DataTypes.INTEGER,
          unique: 'actionsUnique',
          references: {
            model: PESSOA,
            key: 'id',
          },
        },
        ultimaMensagem: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        pendentePor: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        uniqueKeys: {
          actionsUnique: {
            fields: ['pessoa1', 'pessoa2'],
          },
        },
      }
    );
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(MENSAGENS);
  },
};
