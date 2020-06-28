'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'task',
            'sort',
            {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 9999999
            }, {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('task', 'sort');
    }
};