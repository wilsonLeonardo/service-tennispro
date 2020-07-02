import SequelizeStatic, { QueryInterface } from 'sequelize';

import { CLUBE_CAMPEONATO } from '~/utils/constants';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof SequelizeStatic) {
    return (
      queryInterface.removeColumn(CLUBE_CAMPEONATO, 'premio'),
      queryInterface.removeColumn(CLUBE_CAMPEONATO, 'taxaInscricao'),
      queryInterface.removeColumn(CLUBE_CAMPEONATO, 'data'),
      queryInterface.removeColumn(CLUBE_CAMPEONATO, 'nivelId'),
      queryInterface.addColumn(CLUBE_CAMPEONATO, 'dataInicial', {
        type: Sequelize.DataTypes.DATE,
      }),
      queryInterface.addColumn(CLUBE_CAMPEONATO, 'dataFinal', {
        type: Sequelize.DataTypes.DATE,
      })
    );
  },

  async down(queryInterface: QueryInterface) {
    return (
      queryInterface.removeColumn(CLUBE_CAMPEONATO, 'dataInicial'),
      queryInterface.removeColumn(CLUBE_CAMPEONATO, 'dataFinal')
    );
  },
};
