import SequelizeStatic from 'sequelize';

export const migrationDefaults = (Sequelize: typeof SequelizeStatic) => ({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  deletedAt: Sequelize.DATE,
});
