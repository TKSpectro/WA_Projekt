'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('workflow', [{
            name: 'Todo',
            color: '#2A898F',
            sort: 1,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            name: 'In Progress',
            color: '#94CFBD',
            sort: 2,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            name: 'Review',
            color: '#FEA926',
            sort: 3,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            name: 'Done',
            color: '#F53D35',
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