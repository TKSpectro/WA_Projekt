'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING(70),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(70),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(320),
            allowNull: false
        },
        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        permission: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'bit mask of permission from 2^0 to 2^30'
        },
    }, {
        tableName: 'user'
    });

    User.associate = function (models) {
        User.hasMany(models.Task, {
            as: 'taskCreated',
            foreignKey: 'creatorId'
        });

        User.hasMany(models.Task, {
            as: 'tasksAssignedTo',
            foreignKey: 'assignedToId'
        });
    };
    return User;
};