'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('user', [{
            id: 1,
            firstName: 'Tom',
            lastName: 'Käppler',
            email: 't@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 0b1111111111111111
        }, {
            id: 2,
            firstName: 'Bilal',
            lastName: 'Alnaani',
            email: 'b@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 0b1111111111111111
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', null, {});
    }
};
