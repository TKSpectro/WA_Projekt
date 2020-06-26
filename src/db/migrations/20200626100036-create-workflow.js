'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('workflow', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            color: {
                type: Sequelize.STRING(9), // #000000 or rgba #0000000
                allowNull: false,
            },
            sort: {
                allowNull: false,
                type: Sequelize.INTEGER,
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
        return queryInterface.dropTable('workflow');
    }
};