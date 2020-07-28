'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('message', [{
            text: 'Hi Bilal',
            fromId: 1,
            toId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi Tom',
            fromId: 2,
            toId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi @all from Bilal',
            fromId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi @all from Kristof',
            fromId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi @all from Willie',
            fromId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi @all from Era',
            fromId: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi Kristof',
            fromId: 1,
            toId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi Kristof',
            fromId: 3,
            toId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('message', null, {});
    }
};
