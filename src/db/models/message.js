'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'message'
    });
    Message.associate = function (models) {
        Message.belongsTo(models.User, {
            as: 'from',
            foreignKey: 'fromId'
        });

        Message.belongsTo(models.User, {
            as: 'to',
            foreignKey: 'toId',
            allowNull: true
        });
    };
    return Message;
};