import { QueryInterface } from 'sequelize';

import { USUARIO_PLANO } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert(USUARIO_PLANO, [
      {
        plano: 'Gold',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        plano: 'Silver',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        plano: 'Bronze',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.bulkDelete(USUARIO_PLANO, null, {});
  },
};
