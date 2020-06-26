'use strict';
module.exports = (sequelize, DataTypes) => {
    const workflow = sequelize.define('Workflow', {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING(9), // #000000 ir rgba #0000000
            allowNull: false,
        },
        sort: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        }
    }, {
        tableName: 'workflow'
    });

    workflow.associate = function (models) {
        workflow.belongsTo(models.Project, {
            as: 'project',
            foreignKey: 'projectId'
        });
    };
    return workflow;
}