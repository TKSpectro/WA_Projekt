'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('task', [{
            name: 'First Task',
            text: 'This is the first Task',
            alreadyWorkedTime: 0,
            maximumWorkTime: 120,
            deadline: new Date(),
            creatorId: 1,
            assignedToId: 1,
            projectId: 1,
            workflowId: 1,
            sort: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            name: 'Second Task',
            text: 'This is the second Task',
            alreadyWorkedTime: 60,
            maximumWorkTime: 120,
            deadline: new Date(),
            creatorId: 1,
            assignedToId: 2,
            projectId: 1,
            workflowId: 1,
            sort: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            name: 'Third Task',
            text: 'This is the thirdTask',
            alreadyWorkedTime: 60,
            maximumWorkTime: 240,
            deadline: new Date(),
            creatorId: 2,
            assignedToId: 1,
            projectId: 1,
            workflowId: 1,
            sort: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            name: 'Fourth Task',
            text: 'This is the fourthTask',
            alreadyWorkedTime: 120,
            maximumWorkTime: 240,
            deadline: new Date(),
            creatorId: 2,
            assignedToId: 2,
            projectId: 1,
            sort: 3,
            workflowId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            name: 'Fifth Task',
            text: 'This is the fifthTask',
            alreadyWorkedTime: 240,
            maximumWorkTime: 240,
            deadline: new Date(),
            creatorId: 2,
            assignedToId: 2,
            projectId: 1,
            workflowId: 1,
            sort: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('task', null, {});
    }
};
