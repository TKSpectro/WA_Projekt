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
            defaultValue: 9999999
        },
        alreadyWorkedTime: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'time in minutes',
          defaultValue: 0
        },
        maximumWorkTime: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'time in minutes'
        },
        deadline: {
          type: DataTypes.DATE,
          allowNull: false
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

        Task.belongsTo(models.Workflow, {
            as: 'workflow',
            foreignKey: 'workflowId'
        });
    };
    return Task;
};