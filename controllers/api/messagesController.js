/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const Controller = require('../mainController')

class ApiMessagesController extends Controller {

    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['*'], function (next) {
            if (self.req.authorized === true) {
                next();
            } else {
                self.render({}, {
                    statusCode: 401
                });
            }
        });
    }

    async actionIndex() {
        const self = this;

        let messages = [];
        let error = null;

        try {
            messages = await self.db.Message.findAll({
                where: {},
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: self.db.Message.extendInclude
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.render({
                details: error
            }, {
                statusCode: 500
            });
        } else {
            self.render({
                messages: messages
            });
        }
    }

    async actionShow() {
        const self = this;

        let messageId = self.param('id');
        let message = null;
        let error = null;

        try {
            message = await self.db.Message.findOne({
                where: {
                    id: messageId
                },
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: self.db.Message.extendInclude
            });
        } catch (err) {
            error = err;
        }

        if (error !== null) {
            console.error(error);
            self.render({
                details: error
            }, {
                statusCode: 500
            });
        } else {
            self.render({
                message: message
            });
        }
    }

    //Can be used to create a message in db. by sending a json to /api/messages
    async actionCreate() {
        const self = this;

        let remoteData = self.param('message');

        let message = null;
        let error = null;

        try {
            message = await self.db.sequelize.transaction(async (t) => {
                let newMessage = self.db.Message.build();
                newMessage.writeRemotes(remoteData);

                await newMessage.save({
                    transaction: t
                });

                return newMessage;
            });
        } catch (err) {
            error = err;
        }

        if (error !== null) {
            console.error(error);
            self.render({
                details: error
            }, {
                statusCode: 500
            });
        } else {
            self.render({
                message: message
            });
        }
    }

    async actionUpdate() {
        const self = this;

        //message should be a object with all the values (new and old)
        let remoteData = self.param('message');
        let messageId = self.param('id');

        let message = null;
        let error = null;

        //get the old message
        try {
            message = await self.db.Message.findOne({
                where: {
                    id: messageId
                },
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: self.db.Message.extendInclude
            }).then(message => {
                if (message) {
                    //update the message in db
                    message.update({
                        text: remoteData['text'],
                        toId: remoteData['toId'],
                        fromId: remoteData['fromId'],
                        updatedAt: new Date()
                    });

                    return message;
                }
            });
        } catch (err) {
            error = err;
        }

        if (error !== null) {
            console.error(error);
            self.render({
                details: error
            }, {
                statusCode: 500
            });
        } else {
            self.render({
                message: message
            });
        }
    }

    async actionDelete() {
        const self = this;

        let messageId = self.param('id');

        let message = null;
        let error = null;

        //get the old message
        try {
            message = await self.db.Message.findOne({
                where: {
                    id: messageId
                },
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: self.db.Message.extendInclude
            }).then(message => {
                if (message) {
                    //update the message in db
                    message.destroy();

                    return message;
                }
            });
        } catch (err) {
            error = err;
        }

        if (error !== null) {
            console.error(error);
            self.render({
                details: error
            }, {
                statusCode: 500
            });
        } else {
            self.render({
                message: message
            });
        }
    }
}

module.exports = ApiMessagesController;