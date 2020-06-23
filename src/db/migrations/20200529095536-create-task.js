'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('task', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false
      },
      creatorId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'user',
          },
          key: 'id'
        },
        allowNull: false
      },
      assignedToId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'user',
          },
          key: 'id'
        },
        allowNull: true
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'project',
          },
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('task');
  }
};