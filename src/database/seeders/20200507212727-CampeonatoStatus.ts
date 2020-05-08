import { QueryInterface } from 'sequelize';

import { CLUBE_CAMPEONATO_STATUS } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert(CLUBE_CAMPEONATO_STATUS, [
      {
        status: 'Ativo',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: 'Finalizado',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.bulkDelete(CLUBE_CAMPEONATO_STATUS, null, {});
  },
};
