'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('workflow', [{
            name: 'TODO',
            color: '#666666',
            sort: 1,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'In Progress',
            color: '#666666',
            sort: 2,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Review',
            color: '#666666',
            sort: 3,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Done',
            color: '#666666',
            sort: 4,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('workflow', null, {});
    }
};
