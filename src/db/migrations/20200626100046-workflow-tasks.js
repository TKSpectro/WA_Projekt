'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS=0;', { transaction });
            await queryInterface.addColumn(
                'task',
                'workflowId',
                {
                    type: Sequelize.INTEGER,
                    references: {
                        model: {
                            tableName: 'workflow',
                        },
                        key: 'id'
                    },
                    allowNull: false
                }, { transaction }
            );

            const [projects] = await queryInterface.sequelize.query('SELECT * FROM `project`;', { transaction });

            for (let index = 0; index < projects.length; index++) {
                const project = projects[index];
                await queryInterface.bulkInsert('workflow', [{
                    name: 'TODO',
                    color: '#666666',
                    sort: 1,
                    projectId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }, {
                    name: 'In Progress',
                    color: '#666666',
                    sort: 2,
                    projectId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }, {
                    name: 'Review',
                    color: '#666666',
                    sort: 3,
                    projectId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }, {
                    name: 'Done',
                    color: '#666666',
                    sort: 4,
                    projectId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }], { transaction });

                const [workflows] = queryInterface.sequelize.query('SELECT * FROM `workflow` WHERE `projectId` = '+project.id+';', { transaction });
                const workflow = workflows[0];

                const [updateResult] = await queryInterface.sequelize.query('UPDATE `task` SET `workflowId` = '+workflow.id+' WHERE `projectId` = '+project.id+';', { transaction });
            }
            return queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS=1;', { transaction });
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('task', 'workflowId');
    }
};