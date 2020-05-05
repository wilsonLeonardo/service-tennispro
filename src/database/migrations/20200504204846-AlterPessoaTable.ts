import SequelizeStatic, { QueryInterface } from 'sequelize';

import { USUARIO_NIVEL, USUARIO_PLANO, PESSOA } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return (
      queryInterface.addColumn(PESSOA, 'nivelId', {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USUARIO_NIVEL,
          key: 'id',
        },
      }),
      queryInterface.addColumn(PESSOA, 'planoId', {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USUARIO_PLANO,
          key: 'id',
        },
      })
    );
  },

  async down(queryInterface: QueryInterface) {
    return (
      queryInterface.removeColumn(PESSOA, 'nivelId'),
      queryInterface.removeColumn(PESSOA, 'planoId')
    );
  },
};
