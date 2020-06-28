'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('workflow', [{
            name: 'TODO',
            color: '#2ecc71',
            sort: 1,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'In Progress',
            color: '#3498db',
            sort: 2,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Review',
            color: '#9b59b6',
            sort: 3,
            projectId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            name: 'Done',
            color: '#f1c40f',
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
