const { Op } = require("sequelize");
const Controller = require('../mainController');
const ApiError = require('../../core/error.js');

class ApiMessagesController extends Controller {

    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        //user needs to be authorized, else he will get 401: unauthorized
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

    //GET Messages to or from the logged in user
    async actionIndex() {
        const self = this;

        let messages = [];
        let error = null;


        //retrieving params
        let fromId = self.param('fromId') || null;
        let total = 0;
        let paging = self.paging();

        //set a where clause for database request
        try {
            let where = {};

            if (fromId !== null) {
                where = {
                    //we either sent or received the message
                    [Op.or]: [{
                        fromId: fromId,
                        toId: self.req.user.id
                    }, {
                        toId: fromId,
                        fromId: self.req.user.id
                    },]
                };
            } else {
                //global chat: toId is null
                where = {
                    toId: {
                        [Op.is]: null,
                    }
                };
            }
            //get all messages with the where clause from the database
            const { count, rows } = await self.db.Message.findAndCountAll({
                where: where,
                order: [
                    ['id', 'DESC'],

                ],
                limit: paging.limit,
                offset: paging.offset,
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: self.db.Message.extendInclude
            });

            total = count;
            messages = rows;

            //throw a 404 Error if no messages were returned from the database
            if (!messages) {
                throw new ApiError('No messages found', 404);
            }
        } catch (err) {
            error = err;
            console.log(err);
        }

        //handle error or return all found messages
        if (error) {
            self.handleError(error);
        } else {
            self.render({
                messages: messages,
                _meta: self.meta(paging, total)
            });
        }
    }

    //Get a specific message - will only return it if the logged in user is the sender of it
    async actionShow() {
        const self = this;

        let id = self.param('id');
        let message = null;
        let error = null;

        //Get the message from the database
        try {
            message = await self.db.Message.findOne({
                where: {
                    fromId: self.req.user.id,
                    id: id
                },
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: self.db.Message.extendInclude
            });

            //Throw 404 if no message was found with the given criteria
            if (!message) {
                throw new ApiError('No message found with this id', 404);
            }
        } catch (err) {
            error = err;
            console.log(err);
        }

        //handle error or return the found message
        if (error) {
            self.handleError(error);
        } else {
            self.render({
                message: message
            });
        }
    }

    //POST a new message
    async actionCreate() {
        const self = this;

        let remoteData = self.param('message');

        let message = null;
        let error = null;

        //write the new Message to the database
        try {
            message = await self.db.sequelize.transaction(async (t) => {
                let newMessage = self.db.Message.build();
                newMessage.writeRemotes(remoteData);

                await newMessage.save({
                    transaction: t,
                    lock: true
                });

                return newMessage;
            });
        } catch (err) {
            error = err;
        }

        //handle error or return the created message with statusCode: 201
        if (error) {
            self.handleError(error);
        } else {
            self.render({
                message: message
            }, {
                statusCode: 201
            });
        }
    }

    async actionUpdate() {
        const self = this;
        let error = null;

        //retrieving params
        let id = self.param('id');
        let message = null;


        try {
            //check if body structure is correct
            let remoteMessage = self.param('message');
            if (!remoteMessage) {
                throw new ApiError('Message object is missing, check your body structure', 400);
            }
            if (!remoteMessage.text) {
                throw new ApiError('Message object has no text, check your body structure', 400);
            }

            //find and update the message
            message = await self.db.sequelize.transaction(async (t) => {
                let updatedMessage = await self.db.Message.findOne({
                    where: {
                        fromId: self.req.user.id,
                        id: id
                    }
                }, { transaction: t })
                if (updatedMessage) {
                    await updatedMessage.update({
                        text: remoteMessage['text'],
                    }, {
                        where: {
                            id: id
                        }
                    }, { transaction: t, lock: true });
                } else {
                    throw new ApiError('No message found to update (Maybe you are not the creator of this message)', 404);
                }

                return updatedMessage;
            });
        } catch (err) {
            error = err;
            console.log(err);
        }

        //handle error or return the updated message with statusCode: 202
        if (error) {
            self.handleError(error);
        } else {
            self.render({
                message: message
            }, {
                statusCode: 202
            });
        }
    }

    async actionDelete() {
        //wont delete but obfuscate the message -> change text to 'deleted'
        const self = this;
        let error = null;
        let message = null;

        //retrieving params
        let messageId = self.param('id');

        //get the old message and update it
        try {
            message = await self.db.sequelize.transaction(async (t) => {
                let message = await self.db.Message.findOne({
                    where: {
                        fromId: self.req.user.id,
                        id: messageId
                    }
                }, { transaction: t })
                if (message) {
                    await message.update({
                        text: 'deleted',
                    }, {
                        where: {
                            id: messageId
                        }
                    }, { transaction: t, lock: true });
                } else {
                    //Throw 404 If no message found
                    throw new ApiError('No message found to delete (Maybe you are not the creator of this message)', 404);
                }

                return message;
            });
        } catch (err) {
            error = err;
            console.log(err);
        }

        //handle error or return statusCode: 204 with no body as the message was "deleted"
        if (error) {
            self.handleError(error);
        } else {
            self.render({}, {
                statusCode: 204
            });
        }
    }
}

module.exports = ApiMessagesController;