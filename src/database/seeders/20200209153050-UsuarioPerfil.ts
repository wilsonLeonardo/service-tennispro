import { QueryInterface } from 'sequelize';

import { USUARIO_PERFIL } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert(USUARIO_PERFIL, [
      {
        perfil: 'Usuario',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        perfil: 'Professor',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        perfil: 'Clube',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.bulkDelete(USUARIO_PERFIL, null, {});
  },
};
