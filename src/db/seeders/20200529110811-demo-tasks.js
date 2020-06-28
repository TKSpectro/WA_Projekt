'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('task', [{
            name: 'First Task',
            text: 'This is the first Task',
            creatorId: 1,
            assignedToId: 1,
            projectId: 1,
            workflowId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Second Task',
            text: 'This is the second Task',
            creatorId: 1,
            assignedToId: 2,
            projectId: 1,
            workflowId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Third Task',
            text: 'This is the thirdTask',
            creatorId: 2,
            assignedToId: 1,
            projectId: 1,
            workflowId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Fourth Task',
            text: 'This is the fourthTask',
            creatorId: 2,
            assignedToId: 2,
            projectId: 1,
            workflowId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Fifth Task',
            text: 'This is the fifthTask',
            creatorId: 2,
            assignedToId: 2,
            projectId: 1,
            workflowId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('task', null, {});
    }
};
