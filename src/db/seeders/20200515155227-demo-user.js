'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('user', [{
            id: 1,
            firstName: 'Tom',
            lastName: 'Käppler',
            email: 'tom@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 0b0000000111111110
        }, {
            id: 2,
            firstName: 'Bilal',
            lastName: 'Alnaani',
            email: 'bilal@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 0b0000000111111110
        }, {
            id: 3,
            firstName: 'Root',
            lastName: 'Root',
            email: 'root@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 0b1111111111111110
        }, {
            id: 4,
            firstName: 'Boss',
            lastName: 'Boss',
            email: 'boss@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 0b0000000111111110
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', null, {});
    }
};
