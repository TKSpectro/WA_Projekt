'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('project', [{
            id: 1,
            name: 'First Project',
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            id: 2,
            name: 'Second Project',
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            id: 3,
            name: 'Third Project',
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            id: 4,
            name: 'Fourth Project',
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('project', null, {});
    }
};