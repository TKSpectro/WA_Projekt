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

    /**
     * @api {get} /messages Show messages
     * @apiDescription Shows all public messages if no ?fromId is specified.
     *                 If it is then it will show all messages to or from the user with the fromId
     * @apiName GetMessages
     * @apiGroup Message
     *
     * @apiSuccess {Object[]} messages                  Array of messages.
     * 
     * @apiSuccess {Object} messages.message                One user from the array.
     * 
     * @apiSuccess {Number} messages.message.id                 Users unique id.
     * @apiSuccess {String} messages.message.text               Text of the message.
     * @apiSuccess {String} messages.message.createdAt          Date of creation.
     * @apiSuccess {String} messages.message.updatedAt          Date of last update.
     * 
     * @apiSuccess {Object} messages.message.from               User which send the message
     * @apiSuccess {Number} messages.message.from.id            Users id.
     * @apiSuccess {String} messages.message.from.firstName     Users firstname.
     * @apiSuccess {String} messages.message.from.lastName      Users lastname.
     * @apiSuccess {String} messages.message.from.email         Users email.
     * 
     * @apiSuccess {Object} messages.message.to                 User which receives the message - can be null if message is public.
     * @apiSuccess {Number} [messages.message.to.id]            Users id.
     * @apiSuccess {String} [messages.message.to.firstName]     Users firstname.
     * @apiSuccess {String} [messages.message.to.lastName]      Users lastname.
     * @apiSuccess {String} [messages.message.to.email]         Users email.
     * 
     * @apiSuccess {Object} _meta                               Meta information.
     * @apiSuccess {Number} _meta.page
     * @apiSuccess {Number} _meta.limit
     * @apiSuccess {Number} _meta.total
     * @apiSuccess {Number} _meta.offset
     * @apiSuccess {Number} _meta.previous
     * @apiSuccess {Number} _meta.next
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "messages": [
     *          {
     *              "id": 1,
     *              "text": "message 1 test",
     *              "createdAt": "2020-06-18T13:07:03.000Z",
     *              "updatedAt": "2020-06-18T13:07:03.000Z",
     *              "from": {
     *                  "id": 1,
     *                  "firstName": "firstName",
     *                  "lastName": "lastName",
     *                  "email": "mail@mail.com"
     *              },
     *              "to": null
     *          },
     *          {
     *              "id": 7,
     *              "text": "Hi @all",
     *              "createdAt": "2020-06-18T13:07:03.000Z",
     *              "updatedAt": "2020-06-18T13:07:03.000Z",
     *              "from": {
     *                  "id": 2,
     *                  "firstName": "first",
     *                  "lastName": "name",
     *                  "email": "mail@mail.com"
     *              },
     *              "to": null
     *          }
     *      ],
     *      "_meta": {
     *          "page": 1,
     *          "limit": 25,
     *          "total": 2,
     *          "offset": 0,
     *          "previous": -1,
     *          "next": -1
     *      }
     *  }
     */
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

    /**
     * @api {get} /messages/:id Show message with id
     * @apiName GetMessage
     * @apiGroup Message
     * 
     * @apiSuccess {Object} message                One user from the array.
     * 
     * @apiSuccess {Number} message.id                 Users unique id.
     * @apiSuccess {String} message.text               Text of the message.
     * @apiSuccess {String} message.createdAt          Date of creation.
     * @apiSuccess {String} message.updatedAt          Date of last update.
     * 
     * @apiSuccess {Object} message.from               User which send the message
     * @apiSuccess {Number} message.from.id            Users id.
     * @apiSuccess {String} message.from.firstName     Users firstname.
     * @apiSuccess {String} message.from.lastName      Users lastname.
     * @apiSuccess {String} message.from.email         Users email.
     * 
     * @apiSuccess {Object} message.to                 User which receives the message - can be null if message is public.
     * @apiSuccess {Number} [message.to.id]            Users id.
     * @apiSuccess {String} [message.to.firstName]     Users firstname.
     * @apiSuccess {String} [message.to.lastName]      Users lastname.
     * @apiSuccess {String} [message.to.email]         Users email.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *	{
     *	    "message": {
     *	        "id": 1,
     *	        "text": "Hi User2",
     *	        "createdAt": "2020-06-18T13:07:03.000Z",
     *	        "updatedAt": "2020-06-18T13:07:03.000Z",
     *	        "from": {
     *	            "id": 1,
     *	            "firstName": "firstName",
     *	            "lastName": "lastName",
     *	            "email": "mail@mail.com"
     *	        },
     *	        "to": {
     *	            "id": 2,
     *	            "firstName": "firstName",
     *	            "lastName": "lastName",
     *	            "email": "mail@mail.com"
     *	        }
     *	    }
     * 	}
     */
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

    /**
     * @api {post} /messages/ Create message
     * @apiName CreateMessage
     * @apiGroup Message
     * 
     * @apiExample Usage:
     *  endpoint: http://localhost/api/messages
     * 
     *  json-body:
     *  {
     *      "message": {
     *          "text": "Hi from Postman",
     *          "fromId": 1,
     *          "toId": 2  
     *      }
     *  }
     * 
     * @apiSuccess {Object} message                One user from the array.
     * 
     * @apiSuccess {Number} message.id                 Users unique id.
     * @apiSuccess {String} message.text               Text of the message.
     * @apiSuccess {Number} message.fromId             Sender id.
     * @apiSuccess {Number} message.toId               Receiver id (can be null for public message).
     * @apiSuccess {String} message.createdAt          Date of creation.
     * @apiSuccess {String} message.updatedAt          Date of last update.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *	{
     *      "message": {
     *          "id": 6,
     *          "text": "Hi from ApiDoc",
     *          "fromId": 1,
     *          "toId": 2,
     *          "updatedAt": "2020-06-18T13:54:21.513Z",
     *          "createdAt": "2020-06-18T13:54:21.513Z"
     *      }
     *  }
     */
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

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                message: message
            });
        }
    }

    /**
     * @api {post} /messages/:id/update Update message
     * @apiName UpdateMessage
     * @apiGroup Message
     * 
     * @apiExample Usage:
     *  endpoint: http://localhost/api/messages/:id/update
     * 
     *  json-body:
     *  {
     *      "message": {
     *          "text": "Hi from Postman",
     *          "fromId": 1,
     *          "toId": 2  
     *      }
     *  }
     * 
     * @apiSuccess {Object} message                One user from the array.
     * 
     * @apiSuccess {Number} message.id                 Users unique id.
     * @apiSuccess {String} message.text               Text of the message.
     * @apiSuccess {Number} message.fromId             Sender id.
     * @apiSuccess {Number} message.toId               Receiver id (can be null for public message).
     * @apiSuccess {String} message.createdAt          Date of creation.
     * @apiSuccess {String} message.updatedAt          Date of last update.
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *	{
     *      "message": {
     *          "id": 6,
     *          "text": "Hi from ApiDoc",
     *          "createdAt": "2020-06-18T13:54:21.513Z"
     *          "updatedAt": "2020-06-18T13:54:21.513Z",
     *          "fromId": 1,
     *          "toId": 2,
     *      }
     *  }
     */
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
                    }, { transaction: t });
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

    /**
     * @api {get} /messages/:id/delete Delete message
     * @apiName DeleteMessage
     * @apiGroup Message
     * 
     * @apiSuccess {Object} message                One user from the array.
     * 
     * @apiSuccess {Number} message.id                 Users unique id.
     * @apiSuccess {String} message.text               Text of the message.
     * @apiSuccess {String} message.createdAt          Date of creation.
     * @apiSuccess {String} message.updatedAt          Date of last update.
     * @apiSuccess {Number} message.fromId             Sender id.
     * @apiSuccess {Number} message.toId               Receiver id (can be null for public message).
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
     *	{
     *      "message": {
     *          "id": 6,
     *          "text": "deleted",
     *          "createdAt": "2020-06-18T13:54:21.513Z"
     *          "updatedAt": "2020-06-18T13:54:21.513Z",
     *          "fromId": 1,
     *          "toId": 2,
     *      }
     *  }
     */
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
                    }, { transaction: t });
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