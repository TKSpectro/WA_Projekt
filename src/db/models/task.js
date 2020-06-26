'use strict';
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        name: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sort: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defautlValue: 9999999
        },
    }, {
        tableName: 'task'
    });
    Task.associate = function (models) {
        Task.belongsTo(models.User, {
            as: 'creator',
            foreignKey: 'creatorId'
        });

        Task.belongsTo(models.User, {
            as: 'assignedTo',
            foreignKey: 'assignedToId'
        });

        Task.belongsTo(models.Project, {
            as: 'project',
            foreignKey: 'projectId'
        });
    };
    return Task;
};