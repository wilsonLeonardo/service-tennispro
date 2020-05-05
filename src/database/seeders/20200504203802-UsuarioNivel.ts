import { QueryInterface } from 'sequelize';

import { USUARIO_NIVEL } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert(USUARIO_NIVEL, [
      {
        nivel: 'Especial Pro',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nivel: 'Especial',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nivel: 'Inter A',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nivel: 'Inter B',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nivel: 'Inter C',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nivel: 'Principiante',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nivel: 'Iniciante',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.bulkDelete(USUARIO_NIVEL, null, {});
  },
};
