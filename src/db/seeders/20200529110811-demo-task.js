'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('task', [{
            name: 'First Task',
            text: 'This is the first Task',
            creatorId: 1,
            assignedToId: 1,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Second Task',
            text: 'This is the second Task',
            creatorId: 1,
            assignedToId: 1,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Third Task',
            text: 'This is the thirdTask',
            creatorId: 1,
            assignedToId: 1,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('task', null, {});
    }
};
