'use strict';
module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        name: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
    }, {
        tableName: 'project'
    });
    Project.associate = function (models) {
        Project.hasMany(models.Task, {
            as: 'tasks',
            foreignKey: 'projectId'
        });
    };
    return Project;
};