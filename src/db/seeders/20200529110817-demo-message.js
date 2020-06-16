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
            text: 'Welcome Back Bilal',
            fromId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('message', null, {});
    }
};
