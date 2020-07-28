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
            permission: 510
        }, {
            id: 2,
            firstName: 'Bilal',
            lastName: 'Alnaani',
            email: 'bilal@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 510
        },{
            id: 3,
            firstName: 'Kristof',
            lastName: 'Friess',
            email: 'friess@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 510
        }, {
            id: 4,
            firstName: 'Willie',
            lastName: 'Wildt',
            email: 'willie@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 126
        }, {
            id: 5,
            firstName: 'Era',
            lastName: 'Ellis',
            email: 'era@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
            permission: 112
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', null, {});
    }
};
