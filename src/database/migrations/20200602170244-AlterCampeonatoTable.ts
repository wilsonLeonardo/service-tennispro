import SequelizeStatic, { QueryInterface } from 'sequelize';

import { CLUBE_CAMPEONATO, USUARIO_NIVEL } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return queryInterface.addColumn(CLUBE_CAMPEONATO, 'nivelId', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: USUARIO_NIVEL,
        key: 'id',
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn(CLUBE_CAMPEONATO, 'nivelId');
  },
};
