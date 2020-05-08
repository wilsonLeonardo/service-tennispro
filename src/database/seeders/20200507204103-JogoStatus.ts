import { QueryInterface } from 'sequelize';

import { JOGO_STATUS } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert(JOGO_STATUS, [
      {
        status: 'Pendente',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: 'Ativo',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        status: 'Cancelado',
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
    return queryInterface.bulkDelete(JOGO_STATUS, null, {});
  },
};
