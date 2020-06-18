/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const { Op } = require("sequelize");
const Controller = require('../mainController');
const ApiError = require('../../core/error.js');

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

        //retrieving params
        let fromId = self.param('fromId') || null;
        let total = 0;
        let paging = self.paging();

        try {
            let where = {};

            if (fromId !== null) {
                where = {
                    [Op.or]: [
                        {
                            fromId: fromId,
                            toId: self.req.user.id
                        }, {
                            toId: fromId,
                            fromId: self.req.user.id
                        },
                    ]
                };
            } else {
                where = {
                    toId: {
                        [Op.is]: null,
                    }
                };
            }

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
        } catch (err) {
            error = err;
            console.log(err);
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                messages: messages,
                _meta: self.meta(paging, total)
            });
        }
    }

    async actionShow() {
        const self = this;

        let id = self.param('id');
        let message = null;
        let error = null;

        try {
            message = await self.db.Message.findOne({
                where: {
                    fromId: self.req.user.id,
                    id: id
                },
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: self.db.Message.extendInclude
            });

            if (!message) {
                throw new ApiError('No message found with this id', 404);
            }
        } catch (err) {
            error = err;
            console.log(err);
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                message: message
            });
        }
    }

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
                    transaction: t, 
                    lock: true
                });

                return newMessage;
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                message: message
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
            let remoteMessage = self.param('message');
            if (!remoteMessage) {
                throw new ApiError('Message object is missing, check your body structure', 400);
            }
            if (!remoteMessage.text) {
                throw new ApiError('Message object has no text, check your body structure', 400);
            }

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
                    throw new ApiError('No message found to update', 404);
                }

                return updatedMessage;
            });
        } catch (err) {
            error = err;
            console.log(err);
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                message: message
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

        //get the old message
        try {
            message = await self.db.sequelize.transaction(async (t) => {
                let updatedMessage = await self.db.Message.findOne({
                    where: {
                        fromId: self.req.user.id,
                        id: messageId
                    }
                }, { transaction: t })
                if (updatedMessage) {
                    await updatedMessage.update({
                        text: 'deleted',
                    }, {
                        where: {
                            id: messageId
                        }
                    }, { transaction: t, lock: true });
                } else {
                    throw new ApiError('No message found to update', 404);
                }

                return updatedMessage;
            });
        } catch (err) {
            error = err;
            console.log(err);
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                message: message
            });
        }
    }
}

module.exports = ApiMessagesController;