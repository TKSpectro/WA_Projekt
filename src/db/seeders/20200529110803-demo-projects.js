'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('project', [{
            id: 1,
            name: 'Web-Aufbau',
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            id: 2,
            name: 'CAD',
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            id: 3,
            name: 'Java 2',
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            id: 4,
            name: 'MP 3D',
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('project', null, {});
    }
};