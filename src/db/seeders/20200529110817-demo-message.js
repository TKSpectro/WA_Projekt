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
            text: 'Hi @all',
            fromId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi @all from Root',
            fromId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi @all from Boss',
            fromId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi Root',
            fromId: 3,
            toId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            text: 'Hi Boss',
            fromId: 4,
            toId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('message', null, {});
    }
};
